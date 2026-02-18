import Admin from "../models/admin.model.js";
import ExamStudent from "../models/ExamStudent.js";
import InternStudent from "../models/InternStudent.js";
import Employee from "../models/employee.model.js";
import EmailLog from "../models/EmailLog.js";
import User from "../models/user.model.js";
import TestResult from "../models/TestResult.js";
import ExamSession from "../models/ExamSession.js";
import Bulletin from "../models/Bulletin.js";
import Resource from "../models/Resource.js";
import Feedback from "../models/Feedback.js";
import TestConfig from "../models/TestConfig.js";

import { sendAdminOTP } from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export const getEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json(logs);
  } catch (error) {
    console.error("getEmailLogs error:", error);
    res.status(500).json({ message: "Error fetching logs" });
  }
};


const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const adminRequestLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Credentials required" });
    
    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = hashPassword(password);
    
    // Case-insensitive search for admin
    let admin = await Admin.findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }, 
      password: hashedPassword 
    });
    
    if (!admin) {
        // Double check for legacy plain-text password (case-insensitive)
        admin = await Admin.findOne({ 
            email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }, 
            password: password 
        });
    }
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY missing in adminRequestLogin");
      return res.status(500).json({ message: "Server configuration error." });
    }

    console.log(`[AUTH] Admin login successful for ${admin.email}. Generating token...`);
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' }, 
      process.env.SECRET_KEY, 
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: "Login successful!", 
      token,
      admin: { name: admin.name, email: admin.email }
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    res.status(500).json({ message: "Internal server error!" });
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
      { expiresIn: '24h' }
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
    const legacyStudentsCount = await InternStudent.countDocuments();
    const newStudentsCount = await ExamStudent.countDocuments();
    
    const activeCertificates = await ExamStudent.countDocuments({ status: "active" });
    const revokedCertificates = await ExamStudent.countDocuments({ status: "revoked" });
    const totalEmployees = await Employee.countDocuments();

    // User Data Hub Aggregates
    const contactCount = await User.countDocuments({ source: "contact" });
    const newsletterCount = await User.countDocuments({ source: "newsletter" });
    const workshopCount = await User.countDocuments({ source: "workshop" });

    const feedbackCount = await Feedback.countDocuments();

    res.status(200).json({
      totalStudents: legacyStudentsCount + newStudentsCount,
      appearedCount: await ExamStudent.countDocuments({ testAttempted: true }),
      liveTakingCount: await ExamStudent.countDocuments({ testStartTime: { $exists: true }, testAttempted: false }),
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

export const getLiveTestMonitor = async (req, res) => {
    try {
        const examStudents = await ExamStudent.find({}, 'fullName email college branch year testAttempted testStartTime testEndTime attemptedCount score violationCount assignedQuestions')
            .sort({ testAttempted: 1, testStartTime: -1 });

        const internStudents = await InternStudent.find({}, 'name registration college branch year technology startDate endDate');
        
        const mappedExam = examStudents.map(s => ({
            ...s.toObject(),
            totalQuestions: s.assignedQuestions?.length || 0,
            assignedQuestions: undefined 
        }));

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

        const todayStr = new Date().toISOString().split('T')[0];
        const studentIds = targetedStudents.map(s => s._id);

        await ExamStudent.updateMany(
            { _id: { $in: studentIds } },
            { $set: { testAttempted: true, score: 0, correctCount: 0, wrongCount: 0 } }
        );
        const resultsToCreate = targetedStudents.map(s => ({
            student: s._id,
            fullName: s.fullName,
            email: s.email,
            branch: s.branch,
            year: s.year,
            studentId: s.studentId,
            college: s.college,
            yearGroup,
            branchGroup,
            score: 0,
            correctCount: 0,
            wrongCount: 0,
            totalQuestions: 0,
            testDate: todayStr
        }));

        await TestResult.insertMany(resultsToCreate);

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
        const { date, yearGroup, branchGroup, college } = req.query;
        let query = {};
        
        // If no date provided, default to today
        if (date) {
            query.testDate = date;
        } else {
            query.testDate = new Date().toISOString().split('T')[0];
        }

        if (yearGroup) query.yearGroup = yearGroup;
        if (branchGroup) query.branchGroup = branchGroup;
        if (college) query.college = college;

        const results = await TestResult.find(query)
            .sort({ score: -1, submittedAt: -1 })
            .limit(1000);

        res.json(results);
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
    console.log(otp);
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins

    admin.otp = otp;
    admin.otpExpires = otpExpires;
    await admin.save();
    console.log(`[AUTH-DEBUG] OTP for ${normalizedEmail}: ${otp}`);

    const { success: emailSent, error: smtpError } = await sendAdminOTP(admin.email, otp, 'reset');
    if (emailSent) {
      res.status(200).json({ message: "Reset OTP sent to your email!" });
    } else {
      console.error(`[SMTP-FAILURE] Target: ${admin.email}, Error: ${smtpError}`);
      res.status(500).json({ 
        message: "Failed to send reset OTP.", 
        error: smtpError,
        tip: "Check terminal for [AUTH-DEBUG] OTP if this is a test."
      });
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

    const normalizedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }, 
        otp: otp.toString() 
    });

    if (!admin || !admin.otpExpires || admin.otpExpires < new Date()) {
      return res.status(401).json({ message: "Invalid or expired OTP!" });
    }

    admin.password = hashPassword(newPassword);
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
        res.json(bulletin);
    } catch (error) {
        res.status(500).json({ message: "Error creating bulletin" });
    }
};

export const deleteBulletin = async (req, res) => {
    try {
        await Bulletin.findByIdAndDelete(req.params.id);
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
        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: "Error creating resource" });
    }
};

export const deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
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

    const normalizedEmail = email.trim().toLowerCase();
    
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
        return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = hashPassword(password);

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
