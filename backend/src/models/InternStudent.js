import mongoose from 'mongoose';

const internSchema = new mongoose.Schema({
  name: String,
  registration: { type: String, required: true, unique: true },
  college: String,
  branch: String,
  year: String,
  technology: String,
  startDate: String,
  endDate: String,
});

const InternStudent = mongoose.model('InternStudent', internSchema);
export default InternStudent;
