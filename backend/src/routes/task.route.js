import express from 'express'
import { addTask, getTask } from '../controllers/task.controller.js'

const router = express.Router()

router.post("/add-task", addTask)
router.get("/get-task", getTask)


export default router