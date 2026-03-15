import express from 'express'
import { addTask, getTask, getTaskOfEmp } from '../controllers/task.controller.js'

const router = express.Router()

router.post("/add-task", addTask)
router.get("/get-task", getTask)
router.get("/get-task/:empid", getTaskOfEmp)


export default router