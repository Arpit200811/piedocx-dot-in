import express from "express";
import rateLimit from "express-rate-limit";
import { 
  adminRequestLogin, 
  verifyAdminOTP, 
  getAdminStats, 
  getEmailLogs, 
  forgotPassword, 
  resetPassword,
  getLiveTestMonitor,
  resetStudentTest,
  resumeStudentTest,
  getHistoricalResults,
  getResultMetadata,
  closeGroupSession,
  getTestResultDetail,
  getBulletins,
  createBulletin,
  deleteBulletin,
  getResources,
  createResource,
  deleteResource,
  registerAdmin,
  getFeedbacks,
  deleteFeedback,
  getAuditLogs,
  getStudentDetailedAnswers,
  getQuestionAnalytics,
  recalculateAllScores
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();
const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many requests. Please try again later." }
});

router.post("/request-login", adminAuthLimiter, adminRequestLogin);
router.post("/register", adminAuth, registerAdmin); // Protected route for current admins to add new ones
router.post("/verify-otp", verifyAdminOTP);
router.get("/stats", adminAuth, getAdminStats);
router.get("/email-logs", adminAuth, getEmailLogs);
router.get("/monitor", adminAuth, getLiveTestMonitor);
router.post("/reset-test", adminAuth, resetStudentTest);
router.post("/resume-test", adminAuth, resumeStudentTest);
router.post("/close-session", adminAuth, closeGroupSession);
router.get("/get-historical-results", adminAuth, getHistoricalResults);
router.get("/result-metadata", adminAuth, getResultMetadata);
router.get("/result/:id", adminAuth, getTestResultDetail);
router.post("/forgot-password", adminAuthLimiter, forgotPassword);
router.post("/reset-password", adminAuthLimiter, resetPassword);
router.get("/bulletins", adminAuth, getBulletins);
router.post("/bulletins", adminAuth, createBulletin);
router.delete("/bulletins/:id", adminAuth, deleteBulletin);

router.get("/resources", adminAuth, getResources);
router.post("/resources", adminAuth, createResource);
router.delete("/resources/:id", adminAuth, deleteResource);
router.get("/feedbacks", adminAuth, getFeedbacks);
router.delete("/feedbacks/:id", adminAuth, deleteFeedback);
router.get("/audit-logs", adminAuth, getAuditLogs);
router.get("/student-test-detail/:id", adminAuth, getStudentDetailedAnswers);
router.get("/question-analytics/:testConfigId", adminAuth, getQuestionAnalytics);
router.get("/re-grade-all", adminAuth, recalculateAllScores);

export default router;



