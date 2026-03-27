import test from 'node:test';
import assert from 'node:assert/strict';
import ExamStudent from '../models/ExamStudent.js';
import TestConfig from '../models/TestConfig.js';
import TestResult from '../models/TestResult.js';
import { submissionQueue } from '../queues/testSubmission.queue.js';
import { getQuestions, syncProgress, submitTest, getResults } from './studentAuth.controller.js';

const createRes = () => {
    const res = {
        statusCode: 200,
        payload: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.payload = body;
            return this;
        }
    };
    return res;
};

test('student core exam flow', async () => {
    const originals = {
        findById: ExamStudent.findById,
        findByIdAndUpdate: ExamStudent.findByIdAndUpdate,
        findOne: TestConfig.findOne,
        findByIdConfig: TestConfig.findById,
        resultFindOne: TestResult.findOne,
        resultCount: TestResult.countDocuments,
        queueAdd: submissionQueue.add
    };

    const studentId = '507f1f77bcf86cd799439011';
    const testId = '507f1f77bcf86cd799439012';
    const studentState = {
        _id: studentId,
        studentId: 'PDCX-S000001',
        fullName: 'Test Student',
        year: '3rd Year',
        branch: 'Computer Science & Engineering (CSE)',
        college: 'demo college',
        testAttempted: false,
        assignedQuestions: [
            {
                questionId: 'q1',
                questionText: '2+2?',
                options: ['2', '4', '6', '8'],
                correctAnswer: '4'
            }
        ],
        savedAnswers: {},
        testEndTime: new Date(Date.now() + 15 * 60 * 1000),
        score: 1,
        correctCount: 1,
        wrongCount: 0
    };

    let queuedPayload = null;
    const testConfig = {
        _id: testId,
        title: 'Mock Assessment',
        duration: 30,
        resultsPublished: true,
        questions: [{ questionText: '2+2?' }]
    };

    try {
        ExamStudent.findById = async () => studentState;
        ExamStudent.findByIdAndUpdate = async (_id, update) => {
            if (update?.$set?.savedAnswers) {
                studentState.savedAnswers = update.$set.savedAnswers;
            }
            if (update?.testAttempted === true || update?.$set?.testAttempted === true) {
                studentState.testAttempted = true;
            }
            return studentState;
        };
        TestConfig.findOne = async () => testConfig;
        TestConfig.findById = async () => testConfig;
        TestResult.findOne = () => ({ sort: async () => ({ testConfig: testId, totalQuestions: 1 }) });
        TestResult.countDocuments = async () => 0;
        submissionQueue.add = async (_name, data) => {
            queuedPayload = data;
            return { id: 'job_1' };
        };

        const reqQuestions = { student: { id: studentId }, body: { testId } };
        const resQuestions = createRes();
        await getQuestions(reqQuestions, resQuestions);
        assert.equal(resQuestions.statusCode, 200);
        assert.equal(Array.isArray(resQuestions.payload.questions), true);
        assert.equal(resQuestions.payload.questions.length, 1);

        const reqSync = { student: { id: studentId }, body: { answers: { q1: '4' }, testId } };
        const resSync = createRes();
        await syncProgress(reqSync, resSync);
        assert.equal(resSync.statusCode, 200);
        assert.equal(resSync.payload.success, true);

        const reqSubmit = { student: { id: studentId }, body: { answers: { q1: '4' }, testId } };
        const resSubmit = createRes();
        await submitTest(reqSubmit, resSubmit);
        assert.equal(resSubmit.statusCode, 200);
        assert.equal(resSubmit.payload.status, 'processing');
        assert.equal(queuedPayload.studentId, studentId);
        assert.equal(queuedPayload.testId, testId);

        const reqResults = { student: { id: studentId } };
        const resResults = createRes();
        await getResults(reqResults, resResults);
        assert.equal(resResults.statusCode, 200);
        assert.equal(resResults.payload.score, 1);
        assert.equal(resResults.payload.total, 1);
        assert.equal(resResults.payload.rank, 1);
    } finally {
        ExamStudent.findById = originals.findById;
        ExamStudent.findByIdAndUpdate = originals.findByIdAndUpdate;
        TestConfig.findOne = originals.findOne;
        TestConfig.findById = originals.findByIdConfig;
        TestResult.findOne = originals.resultFindOne;
        TestResult.countDocuments = originals.resultCount;
        submissionQueue.add = originals.queueAdd;
    }
});
