import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import mongoose from 'mongoose';
import ExamStudent from '../models/ExamStudent.js';
import TestConfig from '../models/TestConfig.js';
import TestResult from '../models/TestResult.js';
import { generateAIAnalysis } from '../utils/aiAnalyzer.js';

const REDIS_URL = process.env.REDIS_URL;

let connection;
let submissionWorker;

if (REDIS_URL) {
    connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => Math.min(times * 5000, 30000),
    });

    connection.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            // Silently wait for reconnect
        }
    });

    submissionWorker = new Worker('test-submission-spike', async (job) => {
    const { studentId, testId, answers, submissionType, reason } = job.data;
    console.log(`🚀 Processing Submission for Student: ${studentId}`);

    try {
        const student = await ExamStudent.findById(studentId);
        if (!student || student.testAttempted) return;

        const config = await TestConfig.findById(testId);
        const questionsToGrade = student.assignedQuestions;

        if (!questionsToGrade || questionsToGrade.length === 0) throw new Error('No questions to grade');

        let score = 0, correctCount = 0, wrongCount = 0;
        const detailedAnswers = questionsToGrade.map(q => {
            const isCorrect = answers[q.questionId] === q.correctAnswer;
            if (answers[q.questionId]) {
                if (isCorrect) { score++; correctCount++; } 
                else { wrongCount++; }
            }
            return {
                questionId: q.questionId,
                questionText: q.questionText,
                studentAnswer: answers[q.questionId] || 'SKIPPED',
                correctAnswer: q.correctAnswer,
                isCorrect
            };
        });

        // 1. Update Student Record
        const analysisData = generateAIAnalysis(score, questionsToGrade.length, correctCount, wrongCount, student.violationCount);

        await ExamStudent.findByIdAndUpdate(studentId, {
            $set: {
                testAttempted: true,
                score,
                correctCount,
                wrongCount,
                savedAnswers: answers
            }
        });

        // 2. Create Historical Record
        const todayStr = new Date().toISOString().split('T')[0];
        await TestResult.create({
            student: studentId,
            testConfig: testId,
            fullName: student.fullName,
            email: student.email,
            branch: student.branch,
            year: student.year,
            studentId: student.studentId,
            college: student.college,
            mobile: student.mobile,
            score,
            correctCount,
            wrongCount,
            totalQuestions: questionsToGrade.length,
            violationCount: student.violationCount || 0,
            violationHistory: student.violationHistory || [],
            submissionType: submissionType || 'normal',
            submissionReason: reason || 'Batched Worker Process',
            answers: detailedAnswers,
            testDate: todayStr,
            
            // FEATURE #1: AI Results Doctor analysis results
            aiAnalysis: analysisData.analysis,
            recommendations: analysisData.recommendations
        });

        // 3. Update Global Stats (Optional: could be another queue)
        await TestConfig.findByIdAndUpdate(testId, { $inc: { appearedCount: 1 } });

        console.log(`✅ Submission Success: ${student.email} | Score: ${score}`);
    } catch (err) {
        console.error(`❌ Worker Error for Student ${studentId}:`, err.message);
        throw err; // Allow BullMQ to retry
    }
}, { connection, concurrency: 5 }); // Process 5 submissions at a time

console.log('⚡ BullMQ: Submission Worker Active');
}
