
import express from 'express'
import userInfo, { getAllSubmissions, deleteSubmission } from '../controllers/user.controller.js'
import { adminAuth } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post('/user', userInfo)
router.get('/all-data', adminAuth, getAllSubmissions)
router.delete('/delete/:id', adminAuth, deleteSubmission)

export default router



