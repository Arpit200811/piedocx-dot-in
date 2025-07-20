import express from "express";
import { adminlogin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/admin/login", adminlogin);

export default router;
