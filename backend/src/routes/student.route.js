import express from 'express';
import Student from '../models/student.js';

const router = express.Router();

// Create student and generate QR code URL
router.post('/', async (req, res) => {
  console.log('📥 Incoming data:', req.body); // log form data

  const { registration } = req.body; // ✅ Extract registration number

  try {
    // ✅ Check for existing student with same registration number
    const existing = await Student.findOne({ registration });

    if (existing) {
      return res.status(409).json({ message: 'Registration number already exists' });
    }

    // ✅ Save new student
    const student = new Student(req.body);
    await student.save();

    console.log('✅ Student saved:', student);

    res.status(201).json({
      student,
      qrUrl: `https://piedocx-dot-in-1.onrender.com/student/${student._id}`,
    });
  } catch (error) {
    console.error('❌ Error saving student:', error); // detailed error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});





// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({_id: req.params.id});
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' , error: err.message});
  }
});

export default router;
