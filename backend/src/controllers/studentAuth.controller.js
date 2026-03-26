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
import { submissionQueue } from '../queues/testSubmission.queue.js';

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

        // SECURITY: Prevent field changes if a test session has already been initialized (testId present)
        const isSelfRegisterField = (field) => ['branch', 'fullName', 'college', 'year'].includes(field);
        if (student.testId || student.testAttempted) {
             const keys = Object.keys(req.body);
             if (keys.some(isSelfRegisterField)) {
                 return res.status(403).json({ message: 'Critical fields cannot be changed after starting an exam.' });
             }
        }
        
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

        const currentSessionId = crypto.randomBytes(16).toString('hex');
        
        // Update Session ID and IP for single-device locking
        await ExamStudent.findByIdAndUpdate(student._id, { 
            $set: { 
                currentSessionId,
                lastIp: req.ip || req.headers['x-forwarded-for'] || 'unknown'
            } 
        });

        const sessionToken = jwt.sign(
            { 
                id: student._id, 
                sid: currentSessionId, // FEATURE #11: Session Invalidation Signature
                email: student.email, 
                role: 'student',
                branch: student.branch,
                year: student.year
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
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
            const escapedCollege = studentCollege.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or.unshift({ targetCollege: { $regex: new RegExp(`^${escapedCollege}$`, "i") } });
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

        // Cache for 60 seconds for higher scalability (300+ students)
        await setCache(cacheKey, responseData, 60);

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
                questionTextHindi: q.questionTextHindi || null,
                options: q.options,
                optionsHindi: q.optionsHindi || []
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
                .map(item => item.q)
                .slice(0, 30); // LIMIT: Only 30 questions per student

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
                    questionTextHindi: q.questionTextHindi || null,
                    options: q.options,
                    optionsHindi: q.optionsHindi || []
                }));
            } else {
                const freshStudent = await ExamStudent.findById(student._id);
                student.testEndTime = freshStudent.testEndTime; 
                student.savedAnswers = freshStudent.savedAnswers;
                finalQuestions = freshStudent.assignedQuestions.map(q => ({
                    _id: q.questionId,
                    questionText: q.questionText,
                    questionTextHindi: q.questionTextHindi || null,
                    options: q.options,
                    optionsHindi: q.optionsHindi || []
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

        // SCALING OPTIMIZATION: Do not calculate score during sync. 
        // Sync is just for persistence of answers. Grading happens only at final submission.
        await ExamStudent.findByIdAndUpdate(req.student.id, { 
            $set: { 
                attemptedCount,
                savedAnswers: answers,
                testId: testId
            } 
        });

        res.json({ success: true, message: 'Progress saved' });
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
            // SCALING FIX: If already submitted, return success instead of error 
            // to avoid student panic on double-submit / network retries.
            return res.json({ 
                message: 'Your test was already received and is being processed.',
                status: 'processing'
            });
        }

        const studentYearGroup = getYearGroup(student.year);
        const studentBranchGroup = getBranchGroup(student.branch);
        
        // Find the specific config for this attempt
        const activeTestId = testId || student.testId;
        if (!activeTestId) return res.status(400).json({ message: 'No active test associated with this session.' });

        const config = await TestConfig.findById(activeTestId);

        // Security: Handled by student.testEndTime (with buffer) which includes config.endDate limit
        if (student.testEndTime) {
            const bufferMs = 15 * 60 * 1000; // Increased buffer to 15m to prevent false 403s on slow networks
            if (new Date() > new Date(student.testEndTime.getTime() + bufferMs)) {
                return res.status(403).json({ message: 'Submission Failed: Exam session time limit exceeded.' });
            }
        }

        // --- WORLD CLASS RELIABILITY: OFF-LOAD TO BACKGROUND QUEUE ---
        try {
            await submissionQueue.add(`submit_${student._id}`, {
                studentId: student._id,
                testId: config?._id || activeTestId,
                answers,
                submissionType: submissionType || 'normal',
                reason: reason || 'Manual Submit'
            });

            // Mark as attempted in API layer to prevent dual-submission
            // Use existing student object to save a DB roundtrip
            const currentAnswers = answers || {};
            const savedAnswersInDB = student.savedAnswers || {};
            
            const finalAnswersToStore = (Object.keys(currentAnswers).length >= Object.keys(savedAnswersInDB).length)
                ? currentAnswers 
                : savedAnswersInDB;

            await ExamStudent.findByIdAndUpdate(student._id, { 
                testAttempted: true,
                savedAnswers: finalAnswersToStore 
            });

            return res.json({ 
                message: 'Test received and is being processed.',
                status: 'processing'
            });
        } catch (queueErr) {
            console.error("Queue Error:", queueErr);
            // Fallback: If Redis/Queue fails, try to save minimal state to avoid data loss
            await ExamStudent.findByIdAndUpdate(student._id, { 
                testAttempted: true,
                savedAnswers: answers 
            });
            return res.json({ message: 'Test submitted (fallback mode).' });
        }
    } catch (error) {
        console.error("submitTest error:", error);
        res.status(500).json({ message: 'Submission server error' });
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

        const rank = await TestResult.countDocuments({ 
            testConfig: config._id, 
            score: { $gt: student.score } 
        }) + 1;

        // WORLD-CLASS: Generate contextual "AI" message based on performance
        let aiAnalysis = config.aiAnalysisTemplate || "Keep learning and practicing. You're on the right track!";
        if (student.score > (config.questions?.length || 30) * 0.8) {
            aiAnalysis = `🏆 EXCELLENT! ${aiAnalysis}`;
        }

        res.json({
            score: student.score,
            total: lastResult?.totalQuestions || student.assignedQuestions?.length || config.questions?.length || 30,
            correctCount: student.correctCount,
            wrongCount: student.wrongCount,
            rank: rank,
            title: config.title,
            studentId: student.studentId,
            aiAnalysis: aiAnalysis,
            recommendations: config.recommendations || []
        });
    } catch (error) {
        console.error("getResults error:", error);
        res.status(500).json({ message: 'Error fetching results' });
    }
};

export const logViolation = async (req, res) => {
    try {
        const { reason } = req.body;
        const student = await ExamStudent.findById(req.student.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const violationData = {
            reason: reason || 'Unknown violation',
            timestamp: new Date()
        };

        const updatedStudent = await ExamStudent.findByIdAndUpdate(
            req.student.id,
            { 
                $inc: { violationCount: 1 },
                $push: { violationHistory: violationData }
            },
            { new: true }
        );

        res.json({ 
            success: true, 
            violationCount: updatedStudent.violationCount,
            shouldTerminate: updatedStudent.violationCount >= 3 
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
            .select('testDate score totalQuestions submittedAt createdAt aiAnalysis recommendations')
            .sort({ createdAt: 1 });
            
        const history = results.map(r => ({
            date: r.testDate,
            timestamp: r.submittedAt || r.createdAt,
            score: r.score,
            total: r.totalQuestions,
            aiAnalysis: r.aiAnalysis,
            recommendations: r.recommendations,
            percentage: r.totalQuestions > 0 ? Number(((r.score / r.totalQuestions) * 100).toFixed(1)) : 0
        }));
        
        res.json(history);
    } catch (error) {
        console.error("getPerformanceHistory error:", error);
        res.status(500).json({ message: 'Error fetching performance history' });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        // Feature #10 Fix: Filter by this student's own year/branch group for relevant rankings
        const student = await ExamStudent.findById(req.student.id).select('year branch');
        
        let filter = { testAttempted: true };
        
        if (student) {
            const { getBranchGroup, getYearGroup } = await import('../utils/branchMapping.js');
            const yearGroup = getYearGroup(student.year);
            const branchGroup = getBranchGroup(student.branch);
            
            const type = req.query.type || 'group'; // Default to group-wise for relevance
            
            let query = {};
            if (type === 'group') {
                query = { 
                    yearGroup,
                    branchGroup
                };
            }

            // Feature #10 Fix: Use TestResult for accurate scores (not stale ExamStudent.score)
            const topResults = await TestResult
                .find(query)
                .sort({ score: -1, createdAt: 1 })
                .limit(20);

            // Get unique students from results (in case of multiple attempts)
            const seenStudents = new Set();
            const filteredResults = topResults.filter(r => {
                if (seenStudents.has(r.studentId)) return false;
                seenStudents.add(r.studentId);
                return true;
            });
            const leaderboard = filteredResults.map((r, index) => ({
                rank: index + 1,
                name: r.fullName,
                college: r.college,
                branch: r.branch,
                score: r.score,
                total: r.totalQuestions,
                photo: null, // TestResult doesn't store photo (by design)
                id: r.studentId
            }));

            return res.json(leaderboard);
        }

        // Fallback: global leaderboard if student not found
        const topStudents = await ExamStudent.find(filter)
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






