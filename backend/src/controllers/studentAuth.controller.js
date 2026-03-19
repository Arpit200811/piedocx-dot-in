import ExamStudent from '../models/ExamStudent.js';
import TestConfig from '../models/TestConfig.js';
import Feedback from '../models/Feedback.js';
import TestResult from "../models/TestResult.js";
import Bulletin from "../models/Bulletin.js";
import Resource from "../models/Resource.js";
import { getCache, setCache } from '../utils/cacheService.js';
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
        const { profilePicture, mobile, fullName, college, branch, year } = req.body;
        
        const student = await ExamStudent.findById(req.student.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const updateData = {};
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
        if (mobile !== undefined) updateData.mobile = mobile.trim();
        if (fullName !== undefined) updateData.fullName = fullName.trim();
        if (college !== undefined) updateData.college = college.trim();
        if (branch !== undefined) updateData.branch = branch;
        if (year !== undefined) updateData.year = year;

        // If sensitive fields change, we must regenerate the signature to maintain integrity
        const needsResign = updateData.branch !== undefined || updateData.fullName !== undefined || updateData.college !== undefined;

        if (needsResign) {
            const { generateCertificateSignature, generateQR } = await import('../utils/certUtils.js');
            const tempStudent = { ...student.toObject(), ...updateData };
            
            updateData.signature = generateCertificateSignature({
                studentId: tempStudent.studentId,
                course: tempStudent.branch,
                issueDate: new Date(tempStudent.createdAt || Date.now()).toISOString().split('T')[0],
                score: tempStudent.score || 0
            });
            
            // Also regenerate QR to ensure everything is in sync
            const verifyUrl = `${process.env.FRONTEND_URL || 'https://piedocx.in'}/#/verify/${student.certificateId}`;
            updateData.qrCode = await generateQR(verifyUrl);
        }

        const updatedStudent = await ExamStudent.findByIdAndUpdate(
            req.student.id,
            { $set: updateData },
            { new: true }
        );

        res.json({ message: 'Profile updated successfully', student: updatedStudent });
    } catch (error) {
        console.error("updateProfile error:", error);
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

        const cacheKey = `test_info_${studentYearGroup}_${studentBranchGroup}_${studentCollege || 'all'}`;
        const cachedConfig = await getCache(cacheKey);
        
        if (cachedConfig) {
            return res.json(cachedConfig);
        }

        let config = await TestConfig.findOne(query).sort({ createdAt: -1 });

        // FALLBACK: If no ACTIVE test, but student is logged in, look for their previous test
        // This ensures the dashboard still shows the "See My Result" button if results are published
        if (!config && student) {
            const lastResult = await TestResult.findOne({ student: student._id }).sort({ createdAt: -1 });
            if (lastResult) {
                config = await TestConfig.findById(lastResult.testConfig);
            }
        }

        if (!config) {
            // Return 200 with null instead of 404 to avoid console noise for active/dashboard views
            return res.json(null);
        }
        
        const hasKey = !!(config.testAccessKey && config.testAccessKey.trim().length > 0);
        
        const responseData = {
            id: config._id,
            title: config.title,
            yearGroup: config.yearGroup,
            branchGroup: config.branchGroup,
            startDate: config.startDate,
            endDate: config.endDate,
            duration: config.duration,
            totalQuestions: config.questions.length,
            resultsPublished: config.resultsPublished,
            hasAccessKey: hasKey,
            isActive: config.isActive
        };

        // Cache for 5 seconds to keep it extremely fresh while still preventing basic spam
        await setCache(cacheKey, responseData, 5);

        res.json(responseData);
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
            return res.status(403).json({ message: 'Test window has closed. The access code is no longer valid.' });
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
            
            // CACHE OPTIMIZATION: Cache the master question list for this config
            const configCacheKey = `config_q_${config._id}`;
            let masterQuestions = await getCache(configCacheKey);
            
            if (!masterQuestions) {
                // Filter unique questions by trimmed text
                const seen = new Set();
                masterQuestions = config.questions.filter(q => {
                    const text = q.questionText.trim().toLowerCase();
                    if (seen.has(text)) return false;
                    seen.add(text);
                    return true;
                });
                // Cache questions for 10 minutes
                await setCache(configCacheKey, masterQuestions, 600);
            }

            const selectedQuestions = masterQuestions
                .map(q => ({ q, sort: crypto.createHash('md5').update(seed + q._id).digest('hex') }))
                .sort((a, b) => a.sort.localeCompare(b.sort))
                .slice(0, 30)
                .map(item => item.q);

            const questionsToSave = selectedQuestions
                .map(q => ({ q, sort: crypto.createHash('md5').update(q._id + seed).digest('hex') }))
                .sort((a, b) => a.sort.localeCompare(b.sort))
                .map(item => {
                    const originalOptions = [...item.q.options];
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
            const sessionDurationEnd = new Date(nowTime.getTime() + (config.duration * 60 * 1000));
            const configWindowEnd = new Date(config.endDate);
            const testEndTime = sessionDurationEnd < configWindowEnd ? sessionDurationEnd : configWindowEnd;

            const updatedStudent = await ExamStudent.findOneAndUpdate(
                { _id: student._id, assignedQuestions: { $size: 0 } },
                { 
                    $set: { 
                        assignedQuestions: questionsToSave,
                        testStartTime: nowTime,
                        testEndTime: testEndTime,
                        testId: config._id,
                        violationCount: 0
                    } 
                },
                { new: true }
            );

            if (updatedStudent) {
                student.testEndTime = updatedStudent.testEndTime;
                finalQuestions = questionsToSave.map(q => ({
                    _id: q.questionId,
                    questionText: q.questionText,
                    options: q.options
                }));
            } else {
                const freshStudent = await ExamStudent.findById(student._id);
                student.testEndTime = freshStudent.testEndTime; 
                student.savedAnswers = freshStudent.savedAnswers;
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
        const { answers, testId } = req.body;
        const attemptedCount = Object.keys(answers || {}).length;

        // Fetch student to get assigned questions for grading
        const student = await ExamStudent.findById(req.student.id);
        if (!student || student.testAttempted) {
            return res.status(403).json({ message: 'Sync rejected: Test already submitted or student not found.' });
        }

        // Use the testConfig associated with this student's attempt
        const activeTestId = testId || student.testId;
        const config = activeTestId ? await TestConfig.findById(activeTestId) : await TestConfig.findOne({
            yearGroup: getYearGroup(student.year),
            branchGroup: getBranchGroup(student.branch),
            isActive: true
        }).sort({ createdAt: -1 });

        const questionsToGrade = student.assignedQuestions;
        let score = 0;
        let correctCount = 0;
        let wrongCount = 0;

        if (questionsToGrade && questionsToGrade.length > 0) {
            questionsToGrade.forEach(q => {
                const studentAnswer = answers[q.questionId];
                if (studentAnswer) {
                    if (studentAnswer === q.correctAnswer) {
                        score++;
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                }
            });
        }

        await ExamStudent.findByIdAndUpdate(req.student.id, { 
            $set: { 
                attemptedCount,
                savedAnswers: answers,
                score,
                correctCount,
                wrongCount,
                testId: config?._id || student.testId
            } 
        });

        res.json({ success: true, currentScore: score });
    } catch (error) {
        console.error("syncProgress error:", error);
        res.status(500).json({ message: 'Sync failed' });
    }
};

export const submitTest = async (req, res) => {
    try {
        const { answers, testId, submissionType, reason } = req.body;
        const student = await ExamStudent.findById(req.student.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (student.testAttempted) {
             return res.status(400).json({ message: 'You have already submitted this test.' });
        }

        const studentYearGroup = getYearGroup(student.year);
        const studentBranchGroup = getBranchGroup(student.branch);
        
        // Find the specific config for this attempt
        const activeTestId = testId || student.testId;
        const config = activeTestId ? await TestConfig.findById(activeTestId) : await TestConfig.findOne({
            yearGroup: studentYearGroup,
            branchGroup: studentBranchGroup,
            isActive: true
        }).sort({ createdAt: -1 });

        if (config && new Date() > new Date(config.endDate)) {
             return res.status(403).json({ message: 'Submission Rejected: The official exam window has closed.' });
        }

        if (student.testEndTime) {
            const bufferMs = 2 * 60 * 1000; 
            if (new Date() > new Date(student.testEndTime.getTime() + bufferMs)) {
                return res.status(403).json({ message: 'Submission Failed: Time limit exceeded.' });
            }
        }

        const questionsToGrade = student.assignedQuestions;
        if (!questionsToGrade || questionsToGrade.length === 0) {
             return res.status(500).json({ message: 'Grading Error: No questions assigned.' });
        }

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

        const updatedStudent = await ExamStudent.findOneAndUpdate(
            { _id: student._id, testAttempted: false },
            { 
                $set: { 
                    testAttempted: true,
                    score: score,
                    correctCount: correctCount,
                    wrongCount: wrongCount,
                    savedAnswers: answers
                } 
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(400).json({ message: 'Test already submitted or submission in progress.' });
        }

        res.json({ 
            message: 'Test submitted successfully.', 
            total: questionsToGrade.length
        });

        // Background historical record creation
        setImmediate(async () => {
            try {
                // Fetch FRESH student data to capture exact final violationCount/metadata
                const freshStudent = await ExamStudent.findById(student._id);
                if (!freshStudent) return;

                const todayStr = new Date().toISOString().split('T')[0];
                await TestResult.create({
                    student: student._id,
                    testConfig: config?._id, 
                    fullName: freshStudent.fullName,
                    email: freshStudent.email,
                    branch: freshStudent.branch,
                    year: freshStudent.year,
                    studentId: freshStudent.studentId,
                    college: freshStudent.college,
                    mobile: freshStudent.mobile,
                    yearGroup: studentYearGroup,
                    branchGroup: studentBranchGroup,
                    score: score,
                    correctCount: correctCount,
                    wrongCount: wrongCount,
                    totalQuestions: questionsToGrade.length,
                    violationCount: freshStudent.violationCount || 0,
                    submissionType: submissionType || 'normal',
                    submissionReason: reason || (submissionType === 'terminated' ? 'Security Violation' : 'Manual Submit'),
                    answers: detailedAnswers,
                    testDate: todayStr
                });
            } catch (historyErr) {
                console.error("Failed to save historical result in background:", historyErr);
            }
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

        // In getResults, we want to find the test results even if the configuration is no longer 'active'
        // First, see if we have a recorded TestResult for this student
        const lastResult = await TestResult.findOne({ student: student._id }).sort({ createdAt: -1 });
        
        let config = null;
        if (lastResult) {
            config = await TestConfig.findById(lastResult.testConfig);
        } else {
            // Fallback to searching by group if no result record found yet (legacy or in-flight)
            config = await TestConfig.findOne({
                yearGroup: studentYearGroup,
                branchGroup: studentBranchGroup
            }).sort({ createdAt: -1 });
        }
        
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
        const cacheKey = 'active_bulletins';
        const cachedData = await getCache(cacheKey);
        if (cachedData) return res.json(cachedData);

        const bulletins = await Bulletin.find({ isActive: true }).sort({ createdAt: -1 });
        await setCache(cacheKey, bulletins, 300); // 5 mins
        res.json(bulletins);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bulletins" });
    }
};

export const getActiveResources = async (req, res) => {
    try {
        const cacheKey = 'active_resources';
        const cachedData = await getCache(cacheKey);
        if (cachedData) return res.json(cachedData);

        const resources = await (await import("../models/Resource.js")).default.find().sort({ createdAt: -1 });
        await setCache(cacheKey, resources, 300); // 5 mins
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resources" });
    }
};

export const getPerformanceHistory = async (req, res) => {
    try {
        const results = await TestResult.find({ student: req.student.id })
            .select('testDate score totalQuestions submittedAt')
            .sort({ submittedAt: 1 });
            
        const history = results.map(r => ({
            date: r.testDate,
            timestamp: r.submittedAt,
            score: r.score,
            total: r.totalQuestions,
            percentage: r.totalQuestions > 0 ? ((r.score / r.totalQuestions) * 100).toFixed(1) : 0
        }));
        
        res.json(history);
    } catch (error) {
        console.error("getPerformanceHistory error:", error);
        res.status(500).json({ message: 'Error fetching performance history' });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        // Fetch top 10 students globally by score
        // In a real scenario, you might want to filter by specific test or category
        const topStudents = await ExamStudent.find({ testAttempted: true })
            .select('fullName college branch score profilePicture studentId')
            .sort({ score: -1, updatedAt: 1 })
            .limit(10);

        const leaderboard = topStudents.map((s, index) => ({
            rank: index + 1,
            name: s.fullName,
            college: s.college,
            branch: s.branch,
            score: s.score,
            photo: s.profilePicture,
            id: s.studentId
        }));

        res.json(leaderboard);
    } catch (error) {
        console.error("getLeaderboard error:", error);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
};


