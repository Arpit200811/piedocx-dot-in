
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import ExamSession from '../models/ExamSession.js';
import { calculateRiskScore, RISK_THRESHOLDS } from '../utils/riskEngine.js';
// import { setCache, getCache } from '../utils/cacheService.js'; // Optional: Use for live dashboard speed

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust for production
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication Error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.studentId = decoded.id;
      socket.email = decoded.email;
      next();
    } catch (err) {
      next(new Error("Invalid Token"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Student Connected: ${socket.email} (${socket.id})`);

    // 1. Join Exam Room
    socket.on('join_exam', async ({ testId, deviceInfo }) => {
      socket.join(testId);
      socket.testId = testId;

      // Track Session
      try {
        // 1. Check for Active Session on Other Device
        const existingSession = await ExamSession.findOne({ 
            studentId: socket.studentId, 
            testId, 
            status: 'active' 
        });

        if (existingSession && existingSession.socketId !== socket.id) {
            console.log(`⚠️ Multiple login detected for ${socket.email}. Terminating old session.`);
            
            // Notify Old Socket
            io.to(existingSession.socketId).emit('force_terminate', { 
                reason: 'New login detected on another device. Your session is closed here.' 
            });

            // Disconnect Old Socket
            const oldSocket = io.sockets.sockets.get(existingSession.socketId);
            if (oldSocket) oldSocket.disconnect(true);

            // Update DB
            await ExamSession.findByIdAndUpdate(existingSession._id, { 
                status: 'terminated', 
                endTime: new Date(),
                $push: { violationLog: { type: 'DEVICE_CONFLICT', timestamp: new Date() } }
            });
        }

        // Create New Session
        const session = await ExamSession.create({
            studentId: socket.studentId,
            testId,
            socketId: socket.id,
            deviceInfo,
            status: 'active',
            lastActive: new Date()
        });
        
        socket.sessionId = session._id;
        
        // Notify Admin Room
        io.to('admin_monitor').emit('student_joined', { 
            studentId: socket.studentId, 
            email: socket.email,
            testId 
        });

      } catch (err) {
        console.error("Session Create Error:", err);
      }
    });

    // 2. Real-time Heartbeat (every 10-30s)
    socket.on('heartbeat', async ({ timeLeft, answersHash }) => {
        if (!socket.sessionId) return;
        
        await ExamSession.findByIdAndUpdate(socket.sessionId, { 
            lastActive: new Date() 
            // We could update progress here too if needed, but risky for DB load. 
            // Better to keep syncProgress API for data, and socket for status.
        });
    });

    // 3. Risk / Violation Event
    socket.on('violation', async (data) => {
        if (!socket.sessionId) return;
        
        console.log(`⚠️ Violation [${data.type}] from ${socket.email}`);
        
        const session = await ExamSession.findById(socket.sessionId);
        if (!session) return;

        session.violationLog.push({ type: data.type, timestamp: new Date() });
        
        // Recalculate Score
        const riskAnalysis = calculateRiskScore(session.violationLog.map(v => ({ type: v.type })));
        session.riskScore = riskAnalysis.totalScore;
        await session.save();

        // Admin Alert
        io.to('admin_monitor').emit('risk_alert', {
            studentId: socket.studentId,
            email: socket.email,
            riskScore: session.riskScore,
            violation: data.type
        });

        // Auto-Terminate if Critical
        if (session.riskScore >= RISK_THRESHOLDS.AUTO_SUBMIT) {
            socket.emit('force_terminate', { reason: 'Risk Threshold Exceeded' });
            // Also call DB logic to finalize exam
        }
    });

    // 4. Admin Joining Monitor
    socket.on('join_admin_monitor', () => {
        // Add auth check here for admin role
        socket.join('admin_monitor');
        console.log("👀 Admin joined monitor");
    });

    socket.on('disconnect', async () => {
      console.log(`❌ Disconnected: ${socket.email}`);
      if (socket.sessionId) {
          await ExamSession.findByIdAndUpdate(socket.sessionId, { 
              status: 'disconnected',
              endTime: new Date()
          });
      }
    });
  });

  return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
