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
  score: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  feedbackSubmitted: { type: Boolean, default: false },
  violationCount: { type: Number, default: 0 },
  assignedQuestions: [{
      questionId: String,
      questionText: String,
      options: [String],
      correctAnswer: String
  }],
  savedAnswers: { type: Object, default: {} }
});

// Compound index for search optimization in admin panel
schema.index({ fullName: 'text', studentId: 'text', email: 'text', mobile: 'text' });


const ExamStudent = mongoose.model('ExamStudent', schema);
export default ExamStudent;
