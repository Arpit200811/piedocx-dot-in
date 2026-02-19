import express from 'express';
import { 
    sendBulkWhatsApp, 
    checkWhatsAppStatus, 
    manualLogout, 
    manualConnect 
} from '../controllers/whatsapp.controller.js';
import { adminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Start WhatsApp Client
 * POST /api/admin/whatsapp/start
 */
router.post('/start', adminAuth, manualConnect);

/**
 * Get Current Status
 * GET /api/admin/whatsapp/status
 */
router.get('/status', adminAuth, checkWhatsAppStatus);

/**
 * Logout / Disconnect
 * POST /api/admin/whatsapp/logout
 */
router.post('/logout', adminAuth, manualLogout);

/**
 * Bulk Send Certificates
 * POST /api/whatsapp/bulk-send
 */
router.post('/bulk-send', adminAuth, sendBulkWhatsApp);

export default router;
