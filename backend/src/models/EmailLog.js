import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, enum: ['certificate', 'otp'], required: true },
  status: { type: String, enum: ['sent', 'failed'], required: true },
  errorMessage: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('EmailLog', emailLogSchema);
