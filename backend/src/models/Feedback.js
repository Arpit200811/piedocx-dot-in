import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamStudent', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestConfig' },
  responses: [{
    questionText: String,
    rating: Number,
    comment: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
