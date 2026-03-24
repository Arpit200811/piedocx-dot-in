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
import whatsappRoutes from "./routes/whatsapp.route.js";
import errorHandler from "./middlewares/error.middleware.js";

import { initSocket } from "./utils/socketService.js";
import { initRedis } from "./utils/cacheService.js";
import "./workers/testSubmission.worker.js"; // START THE BACKGROUND WORKER

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);
initRedis();
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "https://piedocx.in",
  "https://www.piedocx.in",
  "https://api.piedocx.in",
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, etc)
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, "").toLowerCase();
    
    // Safety check: Allow any subdomain of piedocx.in
    const isDomainMatch = normalizedOrigin.endsWith("piedocx.in");

    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(ao => ao?.toLowerCase() === normalizedOrigin);
    
    if (isAllowed || isDomainMatch) {
      return callback(null, true);
    } else {
      console.error(`[CORS REJECTED] Origin: "${origin}" | Normalized: "${normalizedOrigin}"`);
      return callback(new Error("CORS Policy: This origin is not allowed"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
};

app.use((req, res, next) => {
  // console.log(`[REQUEST] ${req.method} ${req.path} | Origin: ${req.get('origin') || 'no-origin'}`);
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://accounts.google.com",
          "https://widget.tidiochat.com",
          "https://cdnjs.cloudflare.com"
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        "font-src": [
          "'self'",
          "https://fonts.gstatic.com"
        ],
        "frame-src": [
          "'self'",
          "https://accounts.google.com",
          "https://widget.tidiochat.com",
        ],
        "connect-src": [
          "'self'",
          "https://accounts.google.com",
          "https://*.tidiochat.com",
          "*.onrender.com",
          "http://localhost:5002",
          "https://api.piedocx.in",
          "https://cdnjs.cloudflare.com",
          "https://piedocx.in"
        ],
        "img-src": ["'self'", "data:", "https://*.googleusercontent.com", "https://placehold.co"],
      },
    },
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
app.use("/api/whatsapp", whatsappRoutes);
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

  try {
    console.log(`[STARTUP] Initializing WhatsApp Service (Auto Mode)...`);
    const { initializeWhatsApp } = await import("./utils/whatsappService.js");
    const result = await initializeWhatsApp(true);
    console.log(`[STARTUP] WhatsApp Service Result:`, result);
  } catch (err) {
    console.error(`[STARTUP] WhatsApp Initialization Error:`, err.message);
  }

  console.log(`🚀 PIEDOCX Backend Active on Port ${PORT} | VERSION: 2.1.0-AUTH-FIX`);
});
