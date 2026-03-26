import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  college: { type: String, required: true, index: true },
  branch: { type: String, required: true, index: true },
  year: { type: String, required: true, index: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePicture: String,
  technology: String,
  certificateId: { type: String, unique: true, sparse: true },
  signature: { type: String },
  qrCode: { type: String },
  status: { type: String, enum: ['active', 'revoked'], default: 'active', index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  testAttempted: { type: Boolean, default: false, index: true },
  testStartTime: { type: Date },
  testEndTime: { type: Date },
  attemptedCount: { type: Number, default: 0 },
  score: { type: Number, default: 0, index: true },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  feedbackSubmitted: { type: Boolean, default: false },
  violationCount: { type: Number, default: 0 },
  violationHistory: [{
      reason: String,
      timestamp: { type: Date, default: Date.now }
  }],
  assignedQuestions: [{
      questionId: String,
      questionText: String,
      questionTextHindi: String, // Bilingual Persistence
      options: [String],
      optionsHindi: [String], // Optional Hindi persistence
      correctAnswer: String
  }],
  savedAnswers: { type: Object, default: {} },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestConfig', index: true },
  
  // Real-time Status for Admin Dashboard (Item 6)
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  deviceInfo: { type: Object, default: {} },
  currentSessionId: { type: String, index: true }, // SESSION LOCK FOR SECURITY
  lastIp: { type: String }
});

// Compound index for search optimization in admin panel
schema.index({ fullName: 'text', studentId: 'text', email: 'text', mobile: 'text' });


const ExamStudent = mongoose.model('ExamStudent', schema);
export default ExamStudent;
