import express from 'express';
import {
    registerStudent,
    getAllStudents,
    updateStudentStatus,
    deleteStudent,
    verifyCertificate,
    verifyCertificatePublic,
    sendEmailCertificate,
    bulkRegister
} from '../controllers/registration.controller.js';
import { adminAuth } from '../middlewares/auth.middleware.js';
import { registrationRateLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// Public: Student Registration & Verification
router.post('/register', registrationRateLimiter, registerStudent);
router.get('/view/:id', verifyCertificate);
router.get('/verify-public/:id', verifyCertificatePublic);

// Admin: Email & Management
router.post('/send-email', adminAuth, sendEmailCertificate);
router.get('/students', adminAuth, getAllStudents);
router.patch('/students/:id/status', adminAuth, updateStudentStatus);
router.delete('/students/:id', adminAuth, deleteStudent);
router.post('/bulk-register', adminAuth, bulkRegister);

export default router;
