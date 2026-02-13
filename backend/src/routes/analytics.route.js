
import express from 'express';
import { getDeepAnalytics } from '../controllers/analytics.controller.js';
import { adminAuth } from '../middlewares/auth.middleware.js'; // Assuming you have this

const router = express.Router();

router.get('/overview', adminAuth, getDeepAnalytics);

export default router;
