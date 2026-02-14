import { config } from "dotenv";
config(); // Load environment variables first!
import dns from "dns";
dns.setDefaultResultOrder('ipv4first');
import express from "express";
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
import studentAuthRoutes from './routes/studentAuth.route.js';
import testConfigRoutes from './routes/testConfig.route.js';
import analyticsRoutes from './routes/analytics.route.js';


const app = express();
import { createServer } from 'http';
import { initSocket } from './utils/socketService.js';
import { initRedis } from './utils/cacheService.js';
const httpServer = createServer(app);
initSocket(httpServer);
initRedis();


// Production Middleware
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://piedocx-dot-in-1.onrender.com",
  "https://piedocx-dot-in.onrender.com",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://widget.tidiochat.com"],
      "frame-src": ["'self'", "https://accounts.google.com", "https://widget.tidiochat.com"],
      "connect-src": ["'self'", "https://accounts.google.com", "https://*.tidiochat.com", "*.onrender.com"],
      "img-src": ["'self'", "data:", "https://*.googleusercontent.com"],
    },
  },
}));

app.use(parser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes are mounted below with /api prefix

// Routes
app.use("/api/users", router);
app.use("/api/employees", empRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/students", studentRoutes); 
app.use("/api/certificate", registerRoutes); 
app.use('/api/student-auth', studentAuthRoutes); 
app.use('/api/admin/test-config', testConfigRoutes); 
app.use('/api/admin/analytics', analyticsRoutes); 

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

httpServer.listen(5002, async () => {
  await connectDB(); 
  console.log(`Server running on port 5002`);
});
