import express from 'express';
import { 
    googleLogin, 
    getTestInfo, 
    getQuestions, 
    syncProgress, 
    submitTest, 
    getResults, 
    logViolation, 
    submitFeedback,
    updateProfile,
    getProfile,
    getActiveBulletins,
    getActiveResources
} from '../controllers/studentAuth.controller.js';
import { studentAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Routes
router.post('/login', googleLogin);
router.get('/test-info', getTestInfo); 
router.get('/bulletins', getActiveBulletins);
router.get('/resources', getActiveResources); // Middleware handled inside for optional auth

// Protected Routes (Student Only)
router.post('/questions', studentAuth, getQuestions);
router.post('/sync-progress', studentAuth, syncProgress);
router.post('/submit-test', studentAuth, submitTest);
router.get('/results', studentAuth, getResults);
router.post('/log-violation', studentAuth, logViolation);
router.post('/submit-feedback', studentAuth, submitFeedback);
router.get('/profile', studentAuth, getProfile);
router.post('/update-profile', studentAuth, updateProfile);

export default router;
