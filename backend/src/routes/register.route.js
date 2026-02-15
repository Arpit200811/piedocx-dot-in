import express from 'express';
import {
    registerStudent,
    getAllStudents,
    updateStudentStatus,
    deleteStudent,
    verifyCertificate,
    verifyCertificatePublic,
    sendEmailCertificate,
    bulkRegister,
    bulkDelete,
    bulkSendCertificates,
    updateStudentDetails
} from '../controllers/registration.controller.js';
import { adminAuth } from '../middlewares/auth.middleware.js';
import { registrationRateLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// Public: Student Registration & Verification
router.post('/register', registrationRateLimiter, registerStudent);
router.get('/view/:id', verifyCertificate);
router.get('/verify-public/:id', verifyCertificatePublic);

// Admin: Email & Management (send-email is now partially public for auto-send)
router.post('/send-email', sendEmailCertificate);
router.get('/students', adminAuth, getAllStudents);
router.patch('/students/:id/status', adminAuth, updateStudentStatus);
router.delete('/students/:id', adminAuth, deleteStudent);
router.patch('/students/:id', adminAuth, updateStudentDetails);
router.post('/bulk-register', adminAuth, bulkRegister);
router.post('/bulk-delete', adminAuth, bulkDelete);
router.post('/bulk-send-email', adminAuth, bulkSendCertificates);

export default router;
