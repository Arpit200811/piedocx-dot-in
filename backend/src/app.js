import express from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Route imports
import router from './routes/user.route.js';
import empRoutes from './routes/employee.route.js';
import adminRoutes from './routes/admin.route.js';
import taskRoutes from './routes/task.route.js';
import studentRoutes from './routes/student.route.js';

config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
})); // Allow cross-origin requests
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse incoming JSON

// Routes
app.use('/api/users', router);
app.use('/api/employees', empRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/students', studentRoutes); // 👈 Important: use a clear base path

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  connectDB(); // Connect to MongoDB
});
