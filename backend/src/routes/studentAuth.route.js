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
    getActiveResources,
    getPerformanceHistory,
    getLeaderboard
} from '../controllers/studentAuth.controller.js';
import { studentAuth } from '../middlewares/auth.middleware.js';
import { 
    loginSchema, 
    updateProfileSchema, 
    syncProgressSchema, 
    logViolationSchema, 
    submitTestSchema 
} from '../validators/studentAuth.validator.js';

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ 
            message: 'Validation Failed', 
            details: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        });
    }
};

import express from 'express';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// 🛑 RATE LIMITERS FOR WORLD-CLASS RELIABILITY (300+ students)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // 10 logins per 15 mins (Prevents brute force)
    message: { message: "Too many login attempts. Please try again after 15 minutes." }
});

const syncLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3, // Max 3 syncs per minute (Frontend is set to 60s, so 3 is generous but safe)
    message: { message: "Sync frequency limit exceeded." }
});

const violationLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5, // Prevent cheating scripts from spamming violations
    message: { message: "Violation logging error: Too many requests." }
});

// Public Routes
router.post('/login', loginLimiter, validate(loginSchema), googleLogin);
router.get('/test-info', getTestInfo); 
router.get('/bulletins', getActiveBulletins);
router.get('/resources', getActiveResources); 

// Protected Routes (Student Only)
router.post('/questions', studentAuth, getQuestions);
router.post('/sync-progress', studentAuth, syncLimiter, validate(syncProgressSchema), syncProgress);
router.post('/submit-test', studentAuth, validate(submitTestSchema), submitTest);
router.get('/results', studentAuth, getResults);
router.post('/log-violation', studentAuth, violationLimiter, validate(logViolationSchema), logViolation);
router.post('/submit-feedback', studentAuth, submitFeedback);
router.get('/profile', studentAuth, getProfile);
router.post('/update-profile', studentAuth, validate(updateProfileSchema), updateProfile);
router.get('/performance', studentAuth, getPerformanceHistory);
router.get('/leaderboard', studentAuth, getLeaderboard);

export default router;
