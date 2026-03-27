import Admin from "../models/admin.model.js";
import ExamStudent from "../models/ExamStudent.js";
import InternStudent from "../models/InternStudent.js";
import Employee from "../models/employee.model.js";
import { generateAIAnalysis } from "../utils/aiAnalyzer.js";
import EmailLog from "../models/EmailLog.js";
import User from "../models/user.model.js";
import TestResult from "../models/TestResult.js";
import ExamSession from "../models/ExamSession.js";
import Bulletin from "../models/Bulletin.js";
import Resource from "../models/Resource.js";
import Feedback from "../models/Feedback.js";
import TestConfig from "../models/TestConfig.js";
import { getIO } from "../utils/socketService.js";
import { delCache, setCache, getCache } from "../utils/cacheService.js";

import { sendAdminOTP } from "../utils/emailService.js";
import { logAdminAction } from "../utils/auditLogger.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { promisify } from "util";


export const getEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json(logs);
  } catch (error) {
    console.error("getEmailLogs error:", error);
    res.status(500).json({ message: "Error fetching logs" });
  }
};


const scryptAsync = promisify(crypto.scrypt);

const generatePasswordHash = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const keyLength = 64;
  const key = await scryptAsync(password, salt, keyLength);
  return `scrypt$${salt}$${Buffer.from(key).toString("hex")}`;
};

const isLegacySha256Hash = (storedHash) => /^[a-f0-9]{64}$/i.test(storedHash || "");

const verifyPassword = async (password, storedHash) => {
  if (!storedHash) {
    return false;
  }

  if (isLegacySha256Hash(storedHash)) {
    const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
    return legacyHash === storedHash;
  }

  const [algorithm, salt, hashHex] = String(storedHash).split("$");
  if (algorithm !== "scrypt" || !salt || !hashHex) {
    return false;
  }

  const keyLength = Buffer.from(hashHex, "hex").length;
  const derived = await scryptAsync(password, salt, keyLength);
  return crypto.timingSafeEqual(Buffer.from(hashHex, "hex"), Buffer.from(derived));
};

export const adminRequestLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Credentials required" });
    
    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const passwordMatched = await verifyPassword(password, admin.password);
    if (!passwordMatched) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    if (isLegacySha256Hash(admin.password)) {
      admin.password = await generatePasswordHash(password);
      await admin.save();
    }

    // OTP BYPASS (Permanently Disabled as per User Request)
    const secret = process.env.SECRET_KEY;
    if (!secret) return res.status(500).json({ message: "Server configuration error. (SECRET_KEY missing)" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' }, 
      secret, 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      otpRequired: false,
      message: "Login successful!", 
      token,
      admin: { name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    res.status(500).json({ message: "Internal server error! " + (process.env.NODE_ENV !== 'production' ? error.message : "") });
  }
};

export const verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }, 
        otp: otp.toString() 
    });

    if (!admin || !admin.otpExpires || admin.otpExpires < new Date()) {
      return res.status(401).json({ message: "Invalid or expired OTP!" });
    }

    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY missing in verifiedAdminOTP");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' }, 
      process.env.SECRET_KEY, 
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: "Login successful!", 
      token,
      admin: { name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error("verifyAdminOTP error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [
      legacyStudentsCount,
      newStudentsCount,
      activeCertificates,
      revokedCertificates,
      totalEmployees,
      contactCount,
      newsletterCount,
      workshopCount,
      feedbackCount,
      appearedCount,
      liveTakingCount
    ] = await Promise.all([
      InternStudent.countDocuments(),
      ExamStudent.countDocuments(),
      ExamStudent.countDocuments({ status: "active" }),
      ExamStudent.countDocuments({ status: "revoked" }),
      Employee.countDocuments(),
      User.countDocuments({ source: "contact" }),
      User.countDocuments({ source: "newsletter" }),
      User.countDocuments({ source: "workshop" }),
      Feedback.countDocuments(),
      ExamStudent.countDocuments({ testAttempted: true }),
      ExamStudent.countDocuments({ testStartTime: { $exists: true }, testAttempted: false })
    ]);

    res.status(200).json({
      totalStudents: legacyStudentsCount + newStudentsCount,
      appearedCount,
      liveTakingCount,
      activeCertificates: activeCertificates + legacyStudentsCount, // Implicitly active
      revokedCertificates,
      totalEmployees,
      contactCount,
      newsletterCount,
      workshopCount,
      feedbackCount
    });

  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export const getStudentDetailedAnswers = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await ExamStudent.findById(id, 'fullName email studentId college branch year assignedQuestions savedAnswers violationCount violationHistory score');
        if (!student) return res.status(404).json({ message: "Student record not found" });

        const mappedQuestions = student.assignedQuestions.map(q => ({
            ...q.toObject(),
            studentAnswer: student.savedAnswers[q.questionId] || 'NOT_ANSWERED',
            isCorrect: (student.savedAnswers[q.questionId] === q.correctAnswer)
        }));

        res.json({
            fullName: student.fullName,
            email: student.email,
            studentId: student.studentId,
            score: student.score,
            violations: student.violationHistory,
            questions: mappedQuestions
        });
    } catch (err) {
        console.error("getStudentDetailedAnswers error:", err);
        res.status(500).json({ message: "Error fetching student details" });
    }
};

export const getLiveTestMonitor = async (req, res) => {
    try {
        const examStudents = await ExamStudent.find({}, 'fullName email college branch year testAttempted testStartTime testEndTime attemptedCount score violationCount violationHistory assignedQuestions isOnline lastSeen testId savedAnswers')
            .sort({ testAttempted: 1, testStartTime: -1 });

        const internStudents = await InternStudent.find({}, 'name registration college branch year technology startDate endDate');
        
        const mappedExam = examStudents.map(s => {
            const studentObj = s.toObject();
            
            // WORLD-CLASS: Calculate "Draft Score" for students who haven't submitted yet
            // This ensures admins see actual progress even if completion fails.
            if (!studentObj.testAttempted && studentObj.assignedQuestions?.length > 0) {
                let draftScore = 0;
                const answers = studentObj.savedAnswers || {};
                studentObj.assignedQuestions.forEach(q => {
                    const qId = q.questionId || q._id?.toString();
                    const studentAnswerRaw = answers[qId] || answers[q.questionId] || answers[q._id];
                    
                    const studentAnswer = String(studentAnswerRaw || '').trim();
                    const correctAnswer = String(q.correctAnswer || '').trim();

                    if (studentAnswerRaw && studentAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                        draftScore++;
                    }
                });
                studentObj.score = draftScore;
                studentObj.isDraft = true; // Mark as draft so admin knows it's not final
            }

            return {
                ...studentObj,
                totalQuestions: s.assignedQuestions?.length || 0,
                assignedQuestions: undefined 
            };
        });

        const mappedInterns = internStudents.map(s => ({
            fullName: s.name,
            email: `LEGACY-${s.registration}`,
            college: s.college,
            branch: `${s.branch} (${s.technology})`,
            year: s.year,
            testAttempted: true, 
            isLegacy: true,
            score: 'N/A',
            totalQuestions: 0,
            attemptedCount: 0
        }));

        const combined = [...mappedExam, ...mappedInterns];
        res.json(combined);
    } catch (error) {
        console.error("getLiveTestMonitor error:", error);
        res.status(500).json({ message: "Error fetching monitor data" });
    }
};

export const resumeStudentTest = async (req, res) => {
    try {
        const { studentId, extraMinutes } = req.body;
        const student = await ExamStudent.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Reset the block but keep questions and answers intact
        const extension = (parseInt(extraMinutes) || 10) * 60 * 1000;
        const newEndTime = new Date(Date.now() + extension);

        await ExamStudent.findByIdAndUpdate(studentId, {
            testAttempted: false,
            violationCount: 0,
            testEndTime: newEndTime
        });

        await logAdminAction(req, 'STUDENT_TEST_RESUME', studentId, { 
            action: 'Resumed Session',
            extension: `${extraMinutes || 10}m` 
        });

        res.json({ message: "Student has been allowed to resume the test.", newEndTime });
    } catch (error) {
        console.error("resumeStudentTest error:", error);
        res.status(500).json({ message: "Error resuming test session" });
    }
};

export const resetStudentTest = async (req, res) => {
    try {
        const { studentId } = req.body;
        await ExamStudent.findByIdAndUpdate(studentId, {
            testAttempted: false,
            testStartTime: null,
            testEndTime: null,
            attemptedCount: 0,
            score: 0,
            correctCount: 0,
            wrongCount: 0,
            violationCount: 0,
            feedbackSubmitted: false,
            assignedQuestions: [] 
        });
        
        await logAdminAction(req, 'STUDENT_TEST_RESET', studentId, { action: 'Manual Reset' });
        
        res.json({ message: "Student test session has been reset successfully." });
    } catch (error) {
        console.error("resetStudentTest error:", error);
        res.status(500).json({ message: "Error resetting test session" });
    }
};

export const closeGroupSession = async (req, res) => {
    try {
        const { yearGroup, branchGroup, college } = req.body;
        
        const students = await ExamStudent.find({
            testAttempted: false,
        });

        const { getBranchGroup, getYearGroup } = await import("../utils/branchMapping.js");
        
        const targetedStudents = students.filter(s => 
            getYearGroup(s.year) === yearGroup && 
            getBranchGroup(s.branch) === branchGroup &&
            (!college || s.college === college)
        );

        if (targetedStudents.length === 0) {
            return res.json({ message: "No pending students found in this group to close." });
        }

        // Fetch TestConfig to handle scoring correctly (fixed bug where testConfig was undefined)
        const testConfig = await TestConfig.findOne({ 
            yearGroup, 
            branchGroup,
            isActive: true
        });

        if (!testConfig) {
            return res.status(404).json({ message: "No active test configuration found for this group." });
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const studentIds = targetedStudents.map(s => s._id);

        const resultsToCreate = targetedStudents
            .filter(s => s.assignedQuestions && s.assignedQuestions.length > 0)
            .map(s => {
            let score = 0;
            let correctCount = 0;
            let wrongCount = 0;
            const answers = s.savedAnswers || {};
            const questions = s.assignedQuestions || [];

            if (questions.length > 0) {
                questions.forEach(q => {
                    const qId = q.questionId || q._id?.toString(); // Added safety for qId
                    const studentAnswer = answers[qId] || answers[q.questionId] || answers[q._id]; // Added robustness
                    if (studentAnswer) {
                        const sAns = String(studentAnswer).trim().toLowerCase();
                        const cAns = String(q.correctAnswer).trim().toLowerCase();
                        if (sAns === cAns) {
                            score++;
                            correctCount++;
                        } else {
                            wrongCount++;
                        }
                    }
                });
            }

                const detailedAnswers = questions.map(q => {
                    const qId = q.questionId || q._id?.toString();
                    const studentAnswerRaw = answers[qId] || answers[q.questionId] || answers[q._id];
                    const studentAnswer = String(studentAnswerRaw || '').trim();
                    const correctAnswer = String(q.correctAnswer || '').trim();
                    const isCorrect = studentAnswer.toLowerCase() === correctAnswer.toLowerCase();
                    return {
                        questionId: qId,
                        questionText: q.questionText,
                        studentAnswer: studentAnswer || 'SKIPPED',
                        correctAnswer: q.correctAnswer,
                        isCorrect
                    };
                });

                const analysisData = generateAIAnalysis(score, questions.length, correctCount, wrongCount, s.violationCount || 0);

                return {
                    student: s._id,
                    fullName: s.fullName,
                    email: s.email,
                    branch: s.branch,
                    year: s.year,
                    studentId: s.studentId,
                    college: s.college,
                    mobile: s.mobile,
                    yearGroup,
                    branchGroup,
                    testConfig: testConfig._id, // LINK TO THE CORRECT TEST CONFIG
                    score: score,
                    correctCount: correctCount,
                    wrongCount: wrongCount,
                    totalQuestions: questions.length,
                    submissionType: 'system_closed',
                    submissionReason: 'Exam Window Closed by Admin',
                    testDate: todayStr,
                    violationCount: s.violationCount || 0,
                    violationHistory: s.violationHistory || [],
                    answers: detailedAnswers,
                    aiAnalysis: analysisData.analysis,
                    recommendations: analysisData.recommendations
                };
            });

        if (resultsToCreate.length > 0) {
            await TestResult.insertMany(resultsToCreate);
        }

        const closedStudentIds = resultsToCreate.map(r => r.student);

        await ExamStudent.updateMany(
            { _id: { $in: closedStudentIds } },
            { $set: { testAttempted: true } } 
        );

        for (const res of resultsToCreate) {
             await ExamStudent.findByIdAndUpdate(res.student, {
                 $set: { 
                    score: res.score, 
                    correctCount: res.correctCount, 
                    wrongCount: res.wrongCount,
                    testAttempted: true
                 }
             });
        }

        await logAdminAction(req, 'GROUP_SESSION_CLOSE', null, { 
            yearGroup, 
            branchGroup, 
            college, 
            count: targetedStudents.length 
        });

        res.json({ 
            message: `Successfully closed session for ${targetedStudents.length} students.`,
            closedCount: targetedStudents.length
        });

    } catch (error) {
        console.error("closeGroupSession error:", error);
        res.status(500).json({ message: "Error closing group session" });
    }
};


export const getHistoricalResults = async (req, res) => {
    try {
        const isExport = String(req.query.limit).toLowerCase() === 'all';
        const page = isExport ? 1 : (parseInt(req.query.page) || 1);
        const limit = isExport ? 2000000 : (parseInt(req.query.limit) || 20);
        const skipCount = (page - 1) * limit;

        const { date, yearGroup, branchGroup, college, search, minScore, maxScore } = req.query;
        let query = {};
        
        if (date && date.trim() !== "") {
            query.testDate = date;
        }
        // REMOVED: Default to today logic which was hiding older data on initial load.


        if (yearGroup) {
            // Flexible matching: if user sends '3', match both '3' and '3-4'
            if (yearGroup === '3' || yearGroup === '3-4') {
                query.yearGroup = { $in: ['3', '3-4'] };
            } else if (yearGroup === '1-2' || yearGroup === '1' || yearGroup === '2') {
                query.yearGroup = { $in: ['1', '2', '1-2'] };
            } else {
                query.yearGroup = yearGroup;
            }
        }
        if (branchGroup) query.branchGroup = branchGroup;
        if (college) query.college = { $regex: new RegExp(college, 'i') };

        // Score Range Filter
        if (minScore || maxScore) {
            query.score = {};
            if (minScore) query.score.$gte = parseInt(minScore);
            if (maxScore) query.score.$lte = parseInt(maxScore);
        }

        if (search) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { studentId: searchRegex },
                { mobile: searchRegex },
                { college: searchRegex }
            ];
        }

        const totalResults = await TestResult.countDocuments(query);
        const results = await TestResult.find(query)
            .sort({ score: -1, submittedAt: -1 })
            .skip(skipCount)
            .limit(limit);

        if (isExport) {
            return res.json(results);
        }

        res.json({
            results,
            totalPages: Math.ceil(totalResults / limit),
            currentPage: page,
            totalResults
        });
    } catch (error) {
        console.error("getHistoricalResults error:", error);
        res.status(500).json({ message: "Error fetching historical results" });
    }
};

export const getTestResultDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await TestResult.findById(id).lean();
        if (!result) return res.status(404).json({ message: "Result not found" });
        const session = await ExamSession.findOne({ 
            studentId: result.student,
        }).sort({ startTime: -1 }).lean(); 

        res.json({
            ...result,
            session: session || null
        });
    } catch (error) {
        console.error("getTestResultDetail error:", error);
        res.status(500).json({ message: "Error fetching result details" });
    }
};

export const getResultMetadata = async (req, res) => {
    try {
        const dates = await TestResult.distinct("testDate");
        const colleges = await TestResult.distinct("college");
        res.json({
            dates: dates.sort().reverse(),
            colleges: colleges.sort()
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching metadata" });
    }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
    });

    if (!admin) {
      console.log(`[FORGOT-PASSWORD] Admin not found for: ${normalizedEmail}`);
      return res.status(404).json({ message: "Admin not found with this email!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins

    admin.otp = otp;
    admin.otpExpires = otpExpires;
    await admin.save();

    const { success: emailSent, error: smtpError } = await sendAdminOTP(admin.email, otp, 'reset');
    if (emailSent) {
      res.status(200).json({ message: "Reset OTP sent to your email!" });
    } else {
      console.error(`[SMTP-FAILURE] Target: ${admin.email}, Error: ${smtpError}`);
      res.status(500).json({ message: "Failed to send reset OTP." });
    }
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "Required fields missing" });
    if (String(newPassword).length < 10) {
      return res.status(400).json({ message: "Password must be at least 10 characters long" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }, 
        otp: otp.toString() 
    });

    if (!admin || !admin.otpExpires || admin.otpExpires < new Date()) {
      return res.status(401).json({ message: "Invalid or expired OTP!" });
    }

    admin.password = await generatePasswordHash(newPassword);
    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully! Please login." });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
export const getBulletins = async (req, res) => {
    try {
        const bulletins = await Bulletin.find().sort({ createdAt: -1 });
        res.json(bulletins);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bulletins" });
    }
};

export const createBulletin = async (req, res) => {
    try {
        const bulletin = await Bulletin.create(req.body);
        const io = getIO();
        if (io) io.emit('bulletin_updated');
        await delCache('active_bulletins');
        res.json(bulletin);
    } catch (error) {
        res.status(500).json({ message: "Error creating bulletin" });
    }
};

export const deleteBulletin = async (req, res) => {
    try {
        await Bulletin.findByIdAndDelete(req.params.id);
        const io = getIO();
        if (io) io.emit('bulletin_updated');
        await delCache('active_bulletins');
        res.json({ message: "Bulletin deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting bulletin" });
    }
};

export const getResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resources" });
    }
};

export const createResource = async (req, res) => {
    try {
        const resource = await Resource.create(req.body);
        const io = getIO();
        if (io) io.emit('resource_updated');
        await delCache('active_resources');
        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: "Error creating resource" });
    }
};

export const deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        const io = getIO();
        if (io) io.emit('resource_updated');
        await delCache('active_resources');
        res.json({ message: "Resource deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting resource" });
    }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields (name, email, password) are required" });
    }
    if (String(password).length < 10) {
        return res.status(400).json({ message: "Password must be at least 10 characters long" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
        return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await generatePasswordHash(password);

    const newAdmin = await Admin.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({ 
        message: "New admin registered successfully", 
        admin: { 
            id: newAdmin._id,
            name: newAdmin.name, 
            email: newAdmin.email 
        } 
    });

  } catch (error) {
    console.error("registerAdmin error:", error);
    res.status(500).json({ message: "Internal server error during registration" });
  }
};

export const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('studentId', 'fullName email studentId college branch')
            .populate('testId', 'title')
            .sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error("getFeedbacks error:", error);
        res.status(500).json({ message: "Error fetching feedback" });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
        console.error("deleteFeedback error:", error);
        res.status(500).json({ message: "Error deleting feedback" });
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await (await import("../models/AuditLog.js")).default.find()
            .sort({ timestamp: -1 })
            .limit(200);
        res.json(logs);
    } catch (error) {
        console.error("getAuditLogs error:", error);
        res.status(500).json({ message: "Error fetching audit logs" });
    }
};

export const getQuestionAnalytics = async (req, res) => {
    try {
        const { testConfigId } = req.params;
        if (!testConfigId) return res.status(400).json({ message: "Test Config ID required" });

        const cacheKey = `analytics_${testConfigId}`;
        const cached = await getCache(cacheKey);
        if (cached) return res.json(cached);

        // Aggregate results for this test
        const results = await TestResult.find({ testConfig: testConfigId });
        if (results.length === 0) return res.json({ message: "No results yet for this test.", data: [] });

        const statsMap = {};
        
        results.forEach(resItem => {
            resItem.answers.forEach(ans => {
                if (!statsMap[ans.questionId]) {
                    statsMap[ans.questionId] = {
                        questionText: ans.questionText,
                        totalAnswers: 0,
                        correct: 0,
                        wrong: 0,
                        difficulty: 0 // Will be calculated
                    };
                }
                statsMap[ans.questionId].totalAnswers++;
                if (ans.isCorrect) statsMap[ans.questionId].correct++;
                else statsMap[ans.questionId].wrong++;
            });
        });

        const analytics = Object.entries(statsMap).map(([id, s]) => ({
            id,
            text: s.questionText,
            accuracy: Math.round((s.correct / s.totalAnswers) * 100),
            errorRate: Math.round((s.wrong / s.totalAnswers) * 100),
            totalAttempts: s.totalAnswers,
            status: s.correct / s.totalAnswers > 0.7 ? "EASY" : s.correct / s.totalAnswers > 0.4 ? "MEDIUM" : "DIFFICULT"
        })).sort((a, b) => a.accuracy - b.accuracy); // Hardest first

        await setCache(cacheKey, analytics, 300); // 5 min cache
        res.json(analytics);
    } catch (err) {
        console.error("getQuestionAnalytics error:", err);
        res.status(500).json({ message: "Analytics engine failure" });
    }
};

export const recalculateAllScores = async (req, res) => {
    try {
        console.log("🚀 Emergency Re-grading started...");
        const students = await ExamStudent.find({ testAttempted: true });
        let summary = [];

        for (const student of students) {
            const questions = student.assignedQuestions || [];
            const answers = student.savedAnswers || {};
            
            if (questions.length === 0) continue;

            const detailedAnswers = [];
            questions.forEach(q => {
                const qId = q.questionId || q._id?.toString();
                const studentAnswerRaw = answers[qId] || answers[q.questionId] || answers[q._id];
                const studentAnswer = String(studentAnswerRaw || '').trim();
                const correctAnswer = String(q.correctAnswer || '').trim();
                const isCorrect = studentAnswer.toLowerCase() === correctAnswer.toLowerCase();

                if (studentAnswerRaw) {
                    if (isCorrect) {
                        score++;
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                }
                
                detailedAnswers.push({
                    questionId: qId,
                    questionText: q.questionText,
                    studentAnswer: studentAnswer || 'SKIPPED',
                    correctAnswer: q.correctAnswer,
                    isCorrect
                });
            });

            // 5. REGENERATE AI ANALYSIS (AI Results Doctor integration)
            const analysisData = generateAIAnalysis(score, questions.length, correctCount, wrongCount, student.violationCount || 0);

            // Update Student
            const oldScore = student.score;
            student.score = score;
            student.correctCount = correctCount;
            student.wrongCount = wrongCount;
            await student.save();

            // Update corresponding TestResult records
            await TestResult.updateMany(
                { student: student._id },
                { 
                    $set: { 
                        score, 
                        correctCount, 
                        wrongCount,
                        answers: detailedAnswers,
                        aiAnalysis: analysisData.analysis,
                        recommendations: analysisData.recommendations 
                    } 
                }
            );
            
            summary.push({ name: student.fullName, oldScore, newScore: score, aiAnalysis: analysisData.analysis });
        }

        console.log(`✅ Re-grading complete. Recovered ${summary.length} students.`);
        res.json({ 
            message: `Successfully recalculated scores for ${summary.length} students.`, 
            summary 
        });
    } catch (error) {
        console.error("recalculateAllScores error:", error);
        res.status(500).json({ message: "Error during recalculation" });
    }
};
