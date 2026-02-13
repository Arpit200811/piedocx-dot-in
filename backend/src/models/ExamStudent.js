import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studentId: { type: String, required: true },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  profilePicture: String,
  status: { type: String, enum: ['active', 'revoked'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  testAttempted: { type: Boolean, default: false },
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

const ExamStudent = mongoose.model('ExamStudent', schema);
export default ExamStudent;
