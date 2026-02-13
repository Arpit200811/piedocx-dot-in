import InternStudent from '../models/InternStudent.js';

export const createIntern = async (req, res) => {
  const { registration } = req.body;
  try {
    const existing = await InternStudent.findOne({ registration });
    if (existing) {
      return res.status(409).json({ message: 'Registration number already exists' });
    }

    const student = new InternStudent(req.body);
    await student.save();

    res.status(201).json({
      student,
      qrUrl: `${process.env.FRONTEND_URL || 'https://piedocx.in'}/student/${student._id}`,
    });
  } catch (error) {
    console.error("createIntern error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInternById = async (req, res) => {
  try {
    const student = await InternStudent.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Intern record not found' });
    }
    res.json(student);
  } catch (err) {
    console.error("getInternById error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkCreateInterns = async (req, res) => {
  const { students } = req.body;
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: 'Invalid students list' });
  }
  try {
    const results = await InternStudent.insertMany(students, { ordered: false });
    res.status(201).json({ message: `${results.length} interns added`, count: results.length });
  } catch (error) {
    console.error("bulkCreateInterns error:", error);
    res.status(500).json({ message: 'Bulk register failed' });
  }
};
