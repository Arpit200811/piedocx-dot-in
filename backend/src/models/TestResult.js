import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamStudent', required: true },
    testConfig: { type: mongoose.Schema.Types.ObjectId, ref: 'TestConfig', required: true },
    
    // Snapped student info
    fullName: String,
    email: String,
    branch: String,
    year: String,
    studentId: String,
    college: String,
    
    // Grouping info
    yearGroup: String,
    branchGroup: String,
    
    // Score data
    score: Number,
    correctCount: Number,
    wrongCount: Number,
    totalQuestions: Number,
    
    // Detailed Answers
    answers: [{
        questionId: String,
        questionText: String,
        studentAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    }],
    
    // Timing data
    testDate: { type: String, required: true }, // Format: YYYY-MM-DD for easier querying
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient grouping and rank calculation
testResultSchema.index({ testDate: 1, branch: 1, year: 1, score: -1 });

const TestResult = mongoose.model('TestResult', testResultSchema);
export default TestResult;
