import express from 'express';
import { sendBulkWhatsApp, checkWhatsAppStatus } from '../controllers/whatsapp.controller.js';
import { adminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Bulk WhatsApp route
router.post('/bulk-send', adminAuth, sendBulkWhatsApp);

// Status route
router.get('/status', checkWhatsAppStatus);

export default router;
