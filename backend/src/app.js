import { config } from "dotenv";
config(); // Load environment variables first!
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
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
import whatsappRoutes from "./routes/whatsapp.route.js";
import errorHandler from "./middleware/error.middleware.js";

import { initSocket } from "./utils/socketService.js";
import { initRedis } from "./utils/cacheService.js";

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);
initRedis();
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://piedocx-dot-in-1.onrender.com",
  "https://piedocx-dot-in.onrender.com",
  "http://localhost:5173",
  "https://piedocx.in",
  "https://www.piedocx.in",
  "https://piedocx.netlify.app",
  "https://api.piedocx.in",
  "http://api.piedocx.in",
  "http://piedocx.in",
  "http://www.piedocx.in",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, "").toLowerCase();
    
    if (allowedOrigins.map(o => o.toLowerCase()).indexOf(normalizedOrigin) !== -1) {
      return callback(null, true);
    } else {
      console.error(`[CORS REJECTED] Origin: "${origin}" | Normalized: "${normalizedOrigin}"`);
      return callback(new Error("CORS Policy: This origin is not allowed"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path} | Origin: ${req.get('origin') || 'no-origin'}`);
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
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
          "https://cdnjs.cloudflare.com"
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
app.use("/api/admins", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/certificate", registerRoutes);
app.use("/api/student-auth", studentAuthRoutes);
app.use("/api/admin/test-config", testConfigRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/whatsapp", whatsappRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, async () => {
  await connectDB();
  const { initializeWhatsApp } = await import("./utils/whatsappService.js");
  initializeWhatsApp(true);

  console.log(`Server running on port ${PORT}`);
});
