
import express from 'express'
import { empget, emplogin, emplogout, empprofile, empsignup, otpverification } from '../controllers/emp.controller.js'


const router = express.Router()

router.post('/employee/signup', empsignup)
router.post('/employee/login', emplogin)
router.post('/employee/logout', emplogout)
router.get('/employee/profile', empprofile)
router.post('/employee/otp', otpverification)
// router.get('/employee/get', empget)





export default router

