
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
    enum: ['1-2', '3-4'], 
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
  isActive: { type: Boolean, default: true, index: true },
  resultsPublished: { type: Boolean, default: false, index: true }
}, { timestamps: true });

// Index for high-frequency lookup during exam initialization
testConfigSchema.index({ isActive: 1, yearGroup: 1, branchGroup: 1, targetCollege: 1 });

const TestConfig = mongoose.model('TestConfig', testConfigSchema);
export default TestConfig;
