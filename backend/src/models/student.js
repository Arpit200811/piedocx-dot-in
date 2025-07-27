import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: String,
  registration: String,
  college: String,
  branch: String,
  year: String,
  technology: String,
  startDate: String,
  endDate: String,
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
