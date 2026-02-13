import express from 'express';
import { createIntern, getInternById, bulkCreateInterns } from '../controllers/intern.controller.js';
import { adminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', adminAuth, createIntern);
router.get('/:id', getInternById);
router.post('/bulk-register', adminAuth, bulkCreateInterns);

export default router;
