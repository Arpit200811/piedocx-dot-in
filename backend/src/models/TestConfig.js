
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const testConfigSchema = new mongoose.Schema({
  title: { type: String, default: 'General Assessment' },
  yearGroup: { 
    type: String, 
    enum: ['1-2', '3'], 
    required: true,
    default: '1-2'
  },
  branchGroup: { 
    type: String, 
    enum: ['CS-IT', 'CORE'], 
    required: true,
    default: 'CS-IT'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true, default: 30 }, // In minutes
  targetCollege: { type: String, default: 'All' },
  testAccessKey: { type: String, default: '' },
  questions: [questionSchema],
  isActive: { type: Boolean, default: true },
  resultsPublished: { type: Boolean, default: false }
}, { timestamps: true });

const TestConfig = mongoose.model('TestConfig', testConfigSchema);
export default TestConfig;
