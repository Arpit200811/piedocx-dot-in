import express from "express";
import { 
  adminRequestLogin, 
  verifyAdminOTP, 
  getAdminStats, 
  getEmailLogs, 
  forgotPassword, 
  resetPassword,
  getLiveTestMonitor,
  resetStudentTest,
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
  registerAdmin
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/admin/request-login", adminRequestLogin);
router.post("/admin/register", adminAuth, registerAdmin); // Protected route for current admins to add new ones
router.post("/admin/verify-otp", verifyAdminOTP);
router.get("/admin/stats", adminAuth, getAdminStats);
router.get("/admin/email-logs", adminAuth, getEmailLogs);
router.get("/admin/monitor", adminAuth, getLiveTestMonitor);
router.post("/admin/reset-test", adminAuth, resetStudentTest);
router.post("/admin/close-session", adminAuth, closeGroupSession);
router.get("/admin/get-historical-results", adminAuth, getHistoricalResults);
router.get("/admin/result-metadata", adminAuth, getResultMetadata);
router.get("/admin/result/:id", adminAuth, getTestResultDetail);
router.post("/admin/forgot-password", forgotPassword);
router.post("/admin/reset-password", resetPassword);
router.get("/admin/bulletins", adminAuth, getBulletins);
router.post("/admin/bulletins", adminAuth, createBulletin);
router.delete("/admin/bulletins/:id", adminAuth, deleteBulletin);

router.get("/admin/resources", adminAuth, getResources);
router.post("/admin/resources", adminAuth, createResource);
router.delete("/admin/resources/:id", adminAuth, deleteResource);

export default router;



