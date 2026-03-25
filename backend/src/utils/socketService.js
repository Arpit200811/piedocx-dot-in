
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import ExamSession from '../models/ExamSession.js';
import ExamStudent from '../models/ExamStudent.js';
import { calculateRiskScore, RISK_THRESHOLDS } from '../utils/riskEngine.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling'], // Prioritize websocket for stability and speed
    allowEIO3: true
  });

  // SCALING DATA CACHE: In-memory mapping to avoid constant DB queries for high-speed sessions
  const activeSessions = new Map(); // studentId -> { socketId, sessionId }
  const progressBatch = new Map(); // studentId -> progressData

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        console.warn(`[Socket Auth] Connection Attempt Denied: No Token Provided. ID: ${socket.id}`);
        return next(new Error("Authentication Error: Token missing"));
    }

    try {
      // Try Student Secret first as it's the primary use case
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        socket.studentId = decoded.id;
        socket.email = decoded.email;
        socket.role = 'student';
        return next();
      } catch (err) {
        // If student verify fails, try Admin secret
        if (!process.env.SECRET_KEY) {
           console.error("[Socket Auth] SECRET_KEY missing in .env, cannot verify admin.");
           throw new Error("Server config error");
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        socket.user = decoded;
        socket.adminId = decoded.id;
        socket.email = decoded.email;
        socket.role = decoded.role || 'admin';
        return next();
      }
    } catch (err) {
      console.error(`[Socket Auth] Handshake Failed: ${err.message} | ID: ${socket.id}`);
      next(new Error("Invalid Token"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Student Connected: ${socket.email} (${socket.id})`);

    // 1. Join Exam Room (OPTIMIZED: Using JWT info to avoid redundant DB call)
    socket.on('join_exam', async ({ testId, deviceInfo }) => {
      try {
        const { getYearGroup, getBranchGroup } = await import('./branchMapping.js');
        
        const yearGroup = getYearGroup(socket.user.year);
        const branchGroup = getBranchGroup(socket.user.branch || 'CORE');
        const roomName = `${testId}_${yearGroup}`;
        
        socket.join(roomName);
        socket.testId = testId;
        socket.roomName = roomName;

        const existingSession = activeSessions.get(socket.studentId);
        if (existingSession && existingSession.socketId !== socket.id) {
            console.log(`⚠️ Conflict detected for ${socket.email}. Re-using session logic.`);
            io.to(existingSession.socketId).emit('force_terminate', { 
                reason: 'Login detected on another device/tab. This session is now closed.' 
            });
            const oldSocket = io.sockets.sockets.get(existingSession.socketId);
            if (oldSocket) oldSocket.disconnect(true);
        }

        const session = await ExamSession.create({
            studentId: socket.studentId,
            testId,
            socketId: socket.id,
            deviceInfo,
            status: 'active',
            lastActive: new Date()
        });

        // Update ExamStudent status for Live Monitor (Item 6)
        await ExamStudent.findByIdAndUpdate(socket.studentId, {
            isOnline: true,
            lastSeen: new Date(),
            deviceInfo // Store latest fingerprint
        });

        socket.sessionId = session._id;
        activeSessions.set(socket.studentId, { socketId: socket.id, sessionId: session._id });

        io.to('admin_monitor').emit('student_joined', { 
            studentId: socket.studentId, 
            email: socket.email,
            testId 
        });

      } catch (err) {
        console.error("[Socket] join_exam logic error:", err);
      }
    });

    // OPTIMIZED: BATCHED PROGRESS UPDATES (TO FIX THE ADMIN DASHBOARD FREEZE)
    socket.on('progress_update', ({ attemptedCount, totalQuestions, currentQuestion, score }) => {
        if (!socket.studentId) return;
        progressBatch.set(socket.studentId, {
            studentId: socket.studentId,
            attemptedCount,
            totalQuestions,
            currentQuestion,
            score,
            lastSeen: new Date()
        });
    });

    socket.on('heartbeat', async ({ timeLeft }) => {
        if (!socket.sessionId) return;
        
        const now = new Date();
        const lastUpdate = socket.lastHeartbeatUpdate || 0;

        // Throttle DB updates to once every 30 seconds per student
        if (now - lastUpdate > 30000) {
            await ExamSession.findByIdAndUpdate(socket.sessionId, { 
                lastActive: now 
            });
            socket.lastHeartbeatUpdate = now;
        }
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
    socket.on('admin_terminate_student', async ({ studentId, reason }) => {
        if (socket.role !== 'admin') return;
        
        console.log(`🚫 Admin ${socket.email} terminating student ${studentId}`);
        
        const activeSessions = await ExamSession.find({ studentId, status: 'active' });
        for (const session of activeSessions) {
            io.to(session.socketId).emit('force_terminate', { 
                reason: reason || 'Your session has been terminated by an administrator.' 
            });
            const targetSocket = io.sockets.sockets.get(session.socketId);
            if (targetSocket) targetSocket.disconnect(true);
            
            await ExamSession.findByIdAndUpdate(session._id, { 
                status: 'terminated', 
                endTime: new Date() 
            });
        }
    });

    socket.on('admin_warn_student', async ({ studentId, message }) => {
        if (socket.role !== 'admin') return;
        
        console.log(`⚠️ Admin sending warning to student ${studentId}: ${message}`);
        const sessions = await ExamSession.find({ studentId, status: 'active' });
        for (const session of sessions) {
            io.to(session.socketId).emit('admin_warning', { message });
        }
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
          // Update ExamStudent status to offline
          await ExamStudent.findByIdAndUpdate(socket.studentId, {
              isOnline: false,
              lastSeen: new Date()
          });
      }
    });

    socket.on('error', () => { /* Prevent crash */ });
  });

  // ADMIN MONITOR REFRESH LOOP (EVERY 5 SECONDS) - Moved outside connection for scalability
  // This ensures only ONE global timer exists rather than one per student
  const adminFlushInterval = setInterval(() => {
    if (progressBatch.size > 0 || activeSessions.size >= 0) {
      const updates = Array.from(progressBatch.values());
      const stats = {
          onlineCount: activeSessions.size,
          lastSync: new Date()
      };
      
      io.to('admin_monitor').emit('batch_progress_update', { 
          updates, 
          stats 
      });
      progressBatch.clear();
    }
  }, 5000);

  return io;
};

export const getIO = () => {
    return io;
};
