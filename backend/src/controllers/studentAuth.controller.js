import ExamStudent from '../models/ExamStudent.js';
import TestConfig from '../models/TestConfig.js';
import Feedback from '../models/Feedback.js';
import TestResult from "../models/TestResult.js";
import Bulletin from "../models/Bulletin.js";
import Resource from "../models/Resource.js";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getBranchGroup, getYearGroup } from '../utils/branchMapping.js';

export const getProfile = async (req, res) => {
    try {
        const student = await ExamStudent.findById(req.student.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePicture, mobile } = req.body;
        const student = await ExamStudent.findByIdAndUpdate(
            req.student.id,
            { profilePicture, mobile },
            { new: true }
        );
        res.json({ message: 'Profile updated successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'No token provided' });

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;

        const student = await ExamStudent.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not registered. Please register first.' });
        }

        if (student.status === 'revoked') {
            return res.status(403).json({ message: 'Access revoked. Contact administrator.' });
        }

        const sessionToken = jwt.sign(
            { id: student._id, email: student.email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token: sessionToken,
            student: {
                id: student._id,
                firstName: student.fullName.split(' ')[0],
                fullName: student.fullName,
                testAttempted: student.testAttempted,
                feedbackSubmitted: student.feedbackSubmitted,
                studentId: student.studentId,
                email: student.email,
                mobile: student.mobile,
                college: student.college,
                branch: student.branch,
                year: student.year,
                profilePicture: student.profilePicture
            }
        });
    } catch (error) {
        console.error("googleLogin error:", error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export const getTestInfo = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.student = decoded;
            } catch (err) {
                console.log("getTestInfo: Invalid/Expired token provided. Proceeding as guest.");
            }
        }

        let student = null;
        let studentYearGroup = '1-2';
        let studentBranchGroup = 'CS-IT';
        let studentCollege = null;

        if (req.student && req.student.id) {
            student = await ExamStudent.findById(req.student.id);
            if (student) {
                studentYearGroup = getYearGroup(student.year);
                studentBranchGroup = getBranchGroup(student.branch);
                studentCollege = student.college ? student.college.trim().toLowerCase() : null;
            }
        }

        const now = new Date();
        // Prioritize specific college config over 'All', and only pick non-expired ones
        const query = {
            yearGroup: studentYearGroup,
            branchGroup: studentBranchGroup,
            isActive: true,
            endDate: { $gt: now },
            $or: [
                { targetCollege: { $regex: /^all$/i } },
                { targetCollege: null }
            ]
        };

        if (studentCollege) {
            query.$or.unshift({ targetCollege: { $regex: new RegExp(`^${studentCollege}$`, "i") } });
        }

        console.log(`[getTestInfo] Searching for student ${student?.email} (${studentYearGroup}/${studentBranchGroup}). Query:`, JSON.stringify(query));

        let config = await TestConfig.findOne(query).sort({ createdAt: -1 });

        // REMOVED: Fallback to pick 'any' active test. 
        // This was causing 1st year students to see 3rd/4th year tests.
        // if (!config) {
        //     console.log(`[getTestInfo] No active group-specific test. Checking latest active overall.`);
        //     config = await TestConfig.findOne({ isActive: true, endDate: { $gt: now } }).sort({ createdAt: -1 });
        // }

        if (!config) {
            return res.status(404).json({ message: "No active tests available." });
        }
        
        console.log(`[getTestInfo] Selected Config: ${config.title} (ID: ${config._id}) Dates: ${config.startDate} to ${config.endDate}`);
        
        const hasKey = !!(config.testAccessKey && config.testAccessKey.trim().length > 0);
        
        res.json({
            id: config._id,
            title: config.title,
            yearGroup: config.yearGroup,
            branchGroup: config.branchGroup,
            startDate: config.startDate,
            endDate: config.endDate,
            duration: config.duration,
            totalQuestions: config.questions.length,
            resultsPublished: config.resultsPublished,
            hasAccessKey: hasKey
        });
    } catch (error) {
        console.error("getTestInfo error:", error);
        res.status(500).json({ message: 'Error fetching test info' });
    }
};

export const getQuestions = async (req, res) => {
    try {
        const student = await ExamStudent.findById(req.student.id);
        if (!student) return res.status(404).json({ message: 'Student record not found.' });
        if (student.testAttempted) {
             return res.status(403).json({ message: 'You have already completed this test.', testAttempted: true });
        }
        const { accessKey, testId } = req.body;
        const now = new Date();
        let config = null;

        // 1. Try fetching the specific test ID if provided (Strict Mode)
        if (testId) {
            config = await TestConfig.findOne({ _id: testId, isActive: true });
        }

        // 2. Fallback to category-based matching if no ID or ID not found
        if (!config) {
            const studentYearGroup = getYearGroup(student.year);
            const studentBranchGroup = getBranchGroup(student.branch);
            const studentCollege = student.college ? student.college.trim().toLowerCase() : null;

            const query = {
                yearGroup: studentYearGroup,
                branchGroup: studentBranchGroup,
                isActive: true,
                endDate: { $gt: now },
                $or: [
                    { targetCollege: { $regex: /^all$/i } },
                    { targetCollege: null }
                ]
            };

            if (studentCollege) {
                query.$or.unshift({ targetCollege: { $regex: new RegExp(`^${studentCollege}$`, "i") } });
            }

            console.log(`[getQuestions] Searching by group for ${student.email}. Query:`, JSON.stringify(query));
            config = await TestConfig.findOne(query).sort({ createdAt: -1 });
        }

        if (!config) {
            return res.status(404).json({ message: "No active tests found for your category." });
        }

        // ACCESS KEY CHECK
        if (config.testAccessKey && config.testAccessKey.trim() !== "") {
            const { accessKey } = req.body;
            if (!accessKey || accessKey.trim() !== config.testAccessKey.trim()) {
                return res.status(401).json({ 
                    message: `Wrong Access Key. Please enter the correct key.`,
                    requiresKey: true 
                });
            }
        }

        if (now < new Date(config.startDate)) {
            return res.status(403).json({ message: 'Test has not started yet.' });
        }
        if (now > new Date(config.endDate)) {
            return res.status(403).json({ message: 'Test time is over.' });
        }
        
        if (config.questions.length === 0) {
            return res.status(404).json({ message: "Question bank is empty for this category. Please contact admin." });
        }

        let finalQuestions = [];

        if (student.assignedQuestions && student.assignedQuestions.length > 0) {
            finalQuestions = student.assignedQuestions.map(q => ({
                _id: q.questionId, 
                questionText: q.questionText,
                options: q.options
            }));
        } else {
            const seed = req.student.id;
            
            // DE-DUPLICATION LOGIC: Filter unique questions by trimmed text
            const seen = new Set();
            const uniqueQuestions = config.questions.filter(q => {
                const text = q.questionText.trim().toLowerCase();
                if (seen.has(text)) return false;
                seen.add(text);
                return true;
            });

            const selectedQuestions = uniqueQuestions
                .map(q => ({ q, sort: crypto.createHash('md5').update(seed + q._id).digest('hex') }))
                .sort((a, b) => a.sort.localeCompare(b.sort))
                .slice(0, 30)
                .map(item => item.q);

            const questionsToSave = selectedQuestions
                .map(q => ({ q, sort: crypto.createHash('md5').update(q._id + seed).digest('hex') }))
                .sort((a, b) => a.sort.localeCompare(b.sort))
                .map(item => {
                    const originalOptions = [...item.q.options];
                    // Fisher-Yates Shuffle for Options
                    for (let i = originalOptions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [originalOptions[i], originalOptions[j]] = [originalOptions[j], originalOptions[i]];
                    }

                    return {
                        questionId: item.q._id.toString(),
                        questionText: item.q.questionText,
                        options: originalOptions,
                        correctAnswer: item.q.correctAnswer
                    };
                });

            const nowTime = new Date();
            // CRITICAL FIX: Ensure testEndTime does not exceed config window end
            const sessionDurationEnd = new Date(nowTime.getTime() + (config.duration * 60 * 1000));
            const configWindowEnd = new Date(config.endDate);
            const testEndTime = sessionDurationEnd < configWindowEnd ? sessionDurationEnd : configWindowEnd;

            // Atomic update to avoid VersionError race conditions
            const updatedStudent = await ExamStudent.findOneAndUpdate(
                { _id: student._id, assignedQuestions: { $size: 0 } },
                { 
                    $set: { 
                        assignedQuestions: questionsToSave,
                        testStartTime: nowTime,
                        testEndTime: testEndTime
                    } 
                },
                { new: true }
            );

            if (updatedStudent) {
                student.testEndTime = updatedStudent.testEndTime; // Update local reference for remainingSeconds calc
                finalQuestions = questionsToSave.map(q => ({
                    _id: q.questionId,
                    questionText: q.questionText,
                    options: q.options
                }));
            } else {
                const freshStudent = await ExamStudent.findById(student._id);
                student.testEndTime = freshStudent.testEndTime; 
                finalQuestions = freshStudent.assignedQuestions.map(q => ({
                    _id: q.questionId,
                    questionText: q.questionText,
                    options: q.options
                }));
            }
        }

        let remainingSeconds = config.duration * 60;
        if (student.testEndTime) {
             const diff = Math.floor((new Date(student.testEndTime) - now) / 1000);
             remainingSeconds = Math.max(0, diff);
             if (remainingSeconds <= 0) {
             }
        }

        res.json({ 
            questions: finalQuestions, 
            duration: config.duration,
            savedAnswers: student.savedAnswers || {},
            remainingSeconds,
            serverTime: new Date()
        });
    } catch (error) {
        console.error("getQuestions error:", error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
};

export const syncProgress = async (req, res) => {
    try {
        const { answers } = req.body;
        
        // Safety: Calculate attemptedCount from answers automatically
        const attemptedCount = Object.keys(answers || {}).length;

        // Security: Use findOneAndUpdate with condition { testAttempted: false } 
        // to prevent overwriting results if the test is already ended.
        const updated = await ExamStudent.findOneAndUpdate(
            { _id: req.student.id, testAttempted: false },
            { 
                $set: { 
                    attemptedCount,
                    savedAnswers: answers 
                } 
            }
        );

        if (!updated) {
            return res.status(403).json({ message: 'Sync rejected: Test already submitted.' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("syncProgress error:", error);
        res.status(500).json({ message: 'Sync failed' });
    }
};

export const submitTest = async (req, res) => {
    try {
        const { answers } = req.body;
        const student = await ExamStudent.findById(req.student.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (student.testAttempted) {
             return res.status(400).json({ message: 'You have already submitted this test.' });
        }

        if (student.testEndTime) {
            // Increased buffer to 30 minutes to acccount for network lag or dev testing delays
            const bufferMs = 30 * 60 * 1000; 
            if (new Date() > new Date(student.testEndTime.getTime() + bufferMs)) {
                return res.status(403).json({ message: 'Submission Failed: Time is over.' });
            }
        }

        const questionsToGrade = student.assignedQuestions;
        if (!questionsToGrade || questionsToGrade.length === 0) {
             return res.status(500).json({ message: 'Grading Error: No questions assigned.' });
        }

        // Find relevant config for history
        const studentYearGroup = getYearGroup(student.year);
        const studentBranchGroup = getBranchGroup(student.branch);
        const config = await TestConfig.findOne({
            yearGroup: studentYearGroup,
            branchGroup: studentBranchGroup,
            isActive: true
        }).sort({ createdAt: -1 });

        let score = 0;
        let correctCount = 0;
        let wrongCount = 0;
        
        const detailedAnswers = questionsToGrade.map(q => {
            const questionId = q.questionId;
            const studentAnswer = answers[questionId];
            const isCorrect = studentAnswer === q.correctAnswer;
            
            if (studentAnswer) {
                if (isCorrect) {
                    score++;
                    correctCount++;
                } else {
                    wrongCount++;
                }
            }
            
            return {
                questionId,
                questionText: q.questionText,
                studentAnswer: studentAnswer || 'SKIPPED',
                correctAnswer: q.correctAnswer,
                isCorrect: isCorrect
            };
        });

        // ATOMIC UPDATE for Concurrency & Duplicate Protection
        // Use findOneAndUpdate with condition { testAttempted: false } to ensure only one submission is processed
        const updatedStudent = await ExamStudent.findOneAndUpdate(
            { _id: student._id, testAttempted: false },
            { 
                $set: { 
                    testAttempted: true,
                    score: score,
                    correctCount: correctCount,
                    wrongCount: wrongCount,
                    savedAnswers: answers // Final snapshot of answers
                } 
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(400).json({ message: 'Test already submitted or submission in progress.' });
        }

        // Save to historical TestResult
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            await TestResult.create({
                student: student._id,
                testConfig: config?._id, 
                fullName: student.fullName,
                email: student.email,
                branch: student.branch,
                year: student.year,
                studentId: student.studentId,
                college: student.college,
                yearGroup: studentYearGroup,
                branchGroup: studentBranchGroup,
                score: score,
                correctCount: correctCount,
                wrongCount: wrongCount,
                totalQuestions: questionsToGrade.length,
                answers: detailedAnswers, // Save breakdown
                testDate: todayStr
            });
        } catch (historyErr) {
            console.error("Failed to save historical result:", historyErr);
        }

        res.json({ 
            message: 'Test submitted successfully.', 
            total: questionsToGrade.length
        });
    } catch (error) {
        console.error("submitTest error:", error);
        res.status(500).json({ message: 'Submission failed' });
    }
};

export const getResults = async (req, res) => {
    try {
        const student = await ExamStudent.findById(req.student.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const studentYearGroup = getYearGroup(student.year);
        const studentBranchGroup = getBranchGroup(student.branch);

        const config = await TestConfig.findOne({
            yearGroup: studentYearGroup,
            branchGroup: studentBranchGroup,
            isActive: true
        }).sort({ createdAt: -1 });
        
        if (!config || !config.resultsPublished) {
            return res.status(403).json({ message: 'Results are not published yet.' });
        }

        const rank = await ExamStudent.countDocuments({ 
            year: student.year,
            branch: student.branch,
            score: { $gt: student.score } 
        }) + 1;

        res.json({
            score: student.score,
            total: student.assignedQuestions?.length || 30,
            correctCount: student.correctCount,
            wrongCount: student.wrongCount,
            rank: rank,
            title: config.title
        });
    } catch (error) {
        console.error("getResults error:", error);
        res.status(500).json({ message: 'Error fetching results' });
    }
};

export const logViolation = async (req, res) => {
    try {
        const student = await ExamStudent.findById(req.student.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.violationCount = (student.violationCount || 0) + 1;
        await student.save();

        res.json({ 
            success: true, 
            violationCount: student.violationCount,
            shouldTerminate: student.violationCount >= 3 
        });
    } catch (error) {
        console.error("logViolation error:", error);
        res.status(500).json({ message: 'Failed to log violation' });
    }
};

export const submitFeedback = async (req, res) => {
    try {
        const { responses, testId } = req.body;
        const newFeedback = new Feedback({
            studentId: req.student.id,
            testId,
            responses
        });

        await newFeedback.save();
        await ExamStudent.findByIdAndUpdate(req.student.id, { feedbackSubmitted: true });
        res.json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error("submitFeedback error:", error);
        res.status(500).json({ message: 'Feedback submission failed' });
    }
};

export const getActiveBulletins = async (req, res) => {
    try {
        const bulletins = await Bulletin.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(bulletins);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bulletins" });
    }
};

export const getActiveResources = async (req, res) => {
    try {
        const resources = await Resource.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resources" });
    }
};
