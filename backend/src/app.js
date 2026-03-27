import { config } from "dotenv";
config(); // Load environment variables first!
// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first"); // Commented out to prevent MongoDB SRV (EREFUSED) issues

import express from "express";
import { createServer } from "http";
import connectDB from "./config/db.js";
import cors from "cors";
import parser from "cookie-parser";
import helmet from "helmet";

// Route imports
import router from "./routes/user.route.js";
import empRoutes from "./routes/employee.route.js";
import adminRoutes from "./routes/admin.route.js";
import studentRoutes from "./routes/student.route.js";
import registerRoutes from "./routes/register.route.js";
import studentAuthRoutes from "./routes/studentAuth.route.js";
import testConfigRoutes from "./routes/testConfig.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import taskRoutes from "./routes/task.route.js";
// import whatsappRoutes from "./routes/whatsapp.route.js";
import errorHandler from "./middlewares/error.middleware.js";

import { initSocket } from "./utils/socketService.js";
import { initRedis } from "./utils/cacheService.js";
import "./workers/testSubmission.worker.js"; // START THE TEST SUBMISSION WORKER
import "./workers/email.worker.js";         // START THE BULK EMAIL WORKER

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);
initRedis();
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://piedocx.in",
  "https://www.piedocx.in",
  "https://api.piedocx.in",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

// WORLD-CLASS PERMISSIVE CORS FOR HIGH CONCURRENCY RELIABILITY
const corsOptions = {
  origin: true, // MIRRORS THE REQUEST ORIGIN - DYNAMICALLY ALLOWS EVERYTHING
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "token", "x-token"],
  exposedHeaders: ["set-cookie"],
  optionsSuccessStatus: 200 // Use 200 instead of 204 for legacy compatibility
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const isVerboseRequestLog = process.env.NODE_ENV !== 'production' || process.env.ENABLE_REQUEST_LOGS === 'true';
app.use((req, res, next) => {
  if (isVerboseRequestLog && req.method !== 'OPTIONS') {
    console.log(`[REQUEST] ${req.method} ${req.path} | Origin: ${req.get('origin') || 'no-origin'} | IP: ${req.ip}`);
  }
  next();
});

// WEAKENED HELMET FOR LOCAL DEVELOPMENT COMPATIBILITY (Item #9)
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "unsafe-none" }, // MORE LENIENT FOR LOCAL WINDOW OPENING
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "no-referrer-when-downgrade" },
    contentSecurityPolicy: false, // TEMPORARILY DISABLE CSP IF CONNECTION ISSUES PERSIST
  }),
);

app.use(parser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/users", router);
app.use("/api/employees", empRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/certificate", registerRoutes);
app.use("/api/student-auth", studentAuthRoutes);
app.use("/api/admin/test-config", testConfigRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
// app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

app.get("/api/health-check", (req, res) => {
  res.json({ 
    status: "alive", 
    version: "2.1.0-AUTH-FIX", 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/", (req, res) => {
  res.send("API is running... Version: 2.1.0-AUTH-FIX");
});

const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, "0.0.0.0", async () => {
  console.log(`[STARTUP] Attempting to connect to MongoDB...`);
  try {
    await connectDB();
    console.log(`[STARTUP] MongoDB Connection Established.`);
  } catch (err) {
    console.error(`[STARTUP] MongoDB Connection Failed:`, err.message);
  }

  /*
  try {
    console.log(`[STARTUP] Initializing WhatsApp Service (Auto Mode)...`);
    const { initializeWhatsApp } = await import("./utils/whatsappService.js");
    const result = await initializeWhatsApp(true);
    console.log(`[STARTUP] WhatsApp Service Result:`, result);
  } catch (err) {
    console.error(`[STARTUP] WhatsApp Initialization Error:`, err.message);
  }
  */

  console.log(`🚀 PIEDOCX Backend Active on Port ${PORT} | VERSION: 2.1.0-AUTH-FIX`);
});
