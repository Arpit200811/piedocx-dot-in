
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamStudent', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestConfig' },
  socketId: String,
  
  // Device Fingerprinting
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    ip: String,
    userAgent: String
  },

  // Timeline
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  lastActive: Date,
  
  // Status
  status: { type: String, enum: ['active', 'completed', 'terminated', 'disconnected'], default: 'active' },
  disconnectCount: { type: Number, default: 0 },
  
  // Risk Data
  riskScore: { type: Number, default: 0 },
  violationLog: [{
    type: { type: String },
    timestamp: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed
  }]
}, { timestamps: true });

// Ensure one active session per student per test
sessionSchema.index({ studentId: 1, testId: 1, status: 1 });

const ExamSession = mongoose.model('ExamSession', sessionSchema);
export default ExamSession;
