
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import ExamSession from '../models/ExamSession.js';
import { calculateRiskScore, RISK_THRESHOLDS } from '../utils/riskEngine.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
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
      try {
        const { getYearGroup } = await import('./branchMapping.js');
        const StudentModel = (await import('../models/ExamStudent.js')).default;
        
        const student = await StudentModel.findById(socket.studentId);
        const yearGroup = student ? getYearGroup(student.year) : 'unknown';
        const roomName = `${testId}_${yearGroup}`;
        
        console.log(`[Socket] join_exam: ${socket.email} joining room ${roomName}`);
        socket.join(roomName);
        socket.testId = testId;
        socket.yearGroup = yearGroup;
        socket.roomName = roomName;
      try {
        const existingSession = await ExamSession.findOne({ 
            studentId: socket.studentId, 
            testId, 
            status: 'active' 
        });

        if (existingSession && existingSession.socketId !== socket.id) {
            console.log(`⚠️ Multiple login detected for ${socket.email}. Terminating old session.`);
            
            io.to(existingSession.socketId).emit('force_terminate', { 
                reason: 'New login detected on another device. Your session is closed here.' 
            });

            const oldSocket = io.sockets.sockets.get(existingSession.socketId);
            if (oldSocket) oldSocket.disconnect(true);

            await ExamSession.findByIdAndUpdate(existingSession._id, { 
                status: 'terminated', 
                endTime: new Date(),
                $push: { violationLog: { type: 'DEVICE_CONFLICT', timestamp: new Date() } }
            });
        }

        const session = await ExamSession.create({
            studentId: socket.studentId,
            testId,
            socketId: socket.id,
            deviceInfo,
            status: 'active',
            lastActive: new Date()
        });
        socket.sessionId = session._id;
        io.to('admin_monitor').emit('student_joined', { 
            studentId: socket.studentId, 
            email: socket.email,
            testId 
        });

      } catch (err) {
        console.error("Session Tracking Error:", err);
      }
    } catch (err) {
      console.error("[Socket] join_exam room logic error:", err);
    }
  });
    socket.on('progress_update', async ({ attemptedCount, totalQuestions, currentQuestion }) => {
        if (!socket.sessionId) return;
        io.to('admin_monitor').emit('student_progress', { 
            studentId: socket.studentId, 
            attemptedCount, 
            totalQuestions,
            currentQuestion,
            lastSeen: new Date()
        });
    });

    socket.on('heartbeat', async ({ timeLeft, answersHash }) => {
        if (!socket.sessionId) return;
        
        await ExamSession.findByIdAndUpdate(socket.sessionId, { 
            lastActive: new Date() 
        });
    });
    socket.on('violation', async (data) => {
        if (!socket.sessionId) return;
        
        console.log(`⚠️ Violation [${data.type}] from ${socket.email}`);
        
        const session = await ExamSession.findById(socket.sessionId);
        if (!session) return;

        session.violationLog.push({ type: data.type, timestamp: new Date() });
      
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
        if (session.riskScore >= RISK_THRESHOLDS.AUTO_SUBMIT) {
            socket.emit('force_terminate', { reason: 'Risk Threshold Exceeded' });
        }
    });
    socket.on('join_admin_monitor', () => {
        socket.join('admin_monitor');
        console.log("👀 Admin joined monitor");
    });
    socket.on('send_broadcast', ({ testId, yearGroup, message, type }) => {
        const payload = { 
            message, 
            type: type || 'info', 
            timestamp: new Date() 
        };

        if (yearGroup) {
            io.to(`${testId}_${yearGroup}`).emit('broadcast_notice', payload);
            console.log(`📢 Broadcast [Group ${yearGroup}] to Room [${testId}]: ${message}`);
        } else {
            io.to(`${testId}_1-2`).emit('broadcast_notice', payload);
            io.to(`${testId}_3-4`).emit('broadcast_notice', payload);
            io.to(`${testId}_unknown`).emit('broadcast_notice', payload);
            console.log(`📢 Global Broadcast to all groups of Room [${testId}]: ${message}`);
        }
    });

    socket.on('disconnect', async () => {
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
    return io;
};
