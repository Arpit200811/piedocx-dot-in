import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import parser from "cookie-parser";

// Route imports
import router from "./routes/user.route.js";
import empRoutes from "./routes/employee.route.js";
import adminRoutes from "./routes/admin.route.js";
import taskRoutes from "./routes/task.route.js";
import studentRoutes from "./routes/student.route.js";
import { UI_URL } from "../../frontend/src/utils/info.js";

config(); // Load environment variables

const app = express();

// Middleware
app.use(
  cors({
    origin: `${UI_URL}`,
    credentials: true,
  })
);
app.use(parser());
app.use(express.json());

app.use(router);
app.use(empRoutes);
app.use(adminRoutes);
app.use(taskRoutes);

app.listen(process.env.PORT, () => {
  connectDB();
});

// Routes
app.use("/api/users", router);
app.use("/api/employees", empRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/students", studentRoutes); // 👈 Important: use a clear base path

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB and start server
// const PORT = process.env.PORT || 5000;
app.listen(5002, () => {
  console.log(`✅ Server running at http://localhost:${5002}`);
  connectDB(); // Connect to MongoDB
});
