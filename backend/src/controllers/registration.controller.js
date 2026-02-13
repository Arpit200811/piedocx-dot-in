
import ExamStudent from '../models/ExamStudent.js';
import { generateCertificateID, generateCertificateSignature, generateQR } from '../utils/certUtils.js';
import { sendCertificateEmail } from '../utils/emailService.js';

export const registerStudent = async (req, res) => {
    try {
        const { fullName, branch, year, mobile, college, email, profilePicture } = req.body;

        const validBranches = [
            'Computer Science & Engineering (CSE)',
            'Information Technology (IT)',
            'Artificial Intelligence & Data Science (AI & DS)',
            'Electronics & Communication (ECE)',
            'Electrical Engineering (EE)',
            'Mechanical Engineering (ME)',
            'Civil Engineering',
            'Automobile Engineering',
            'Other'
        ];

        const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'];

        if (!validBranches.includes(branch)) {
            return res.status(400).json({ message: 'Invalid field of study selected.' });
        }

        if (!validYears.includes(year)) {
            return res.status(400).json({ message: 'Invalid academic year selected.' });
        }

        const existingUser = await ExamStudent.findOne({ 
            $or: [{ email }, { mobile }] 
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ message: 'This email is already registered. Please login.' });
            }
            if (existingUser.mobile === mobile) {
                return res.status(409).json({ message: 'This mobile number is already registered.' });
            }
        }

        // Generate College ID
        const currentYear = new Date().getFullYear();
        const uniqueNumber = Math.floor(100000 + Math.random() * 900000);
        const studentId = `STU-${currentYear}-${uniqueNumber}`;

        // 1. Generate Unique Certificate ID
        const count = await ExamStudent.countDocuments({ year: year });
        const certId = generateCertificateID(currentYear, count + 1);

        // 2. Generate Signature
        const signature = generateCertificateSignature({
            studentId: studentId,
            course: branch,
            issueDate: new Date().toISOString().split('T')[0],
            score: 0 // Initial score
        });

        // 3. QR Code (Pointing to a verification URL)
        const verifyUrl = `${process.env.FRONTEND_URL || 'https://piedocx.in'}/verify/${certId}`;
        const qrCode = await generateQR(verifyUrl);

        const newStudent = new ExamStudent({
            fullName,
            studentId,
            certificateId: certId,
            college: college.trim().toLowerCase(),
            branch,
            year,
            mobile,
            email,
            profilePicture,
            signature,
            qrCode
        });

        await newStudent.save();
        
        // Send Email (Optional)
        // sendCertificateEmail(email, fullName, certId);

        res.status(201).json({ message: 'Registration Successful', student: newStudent });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ message: `${field} already exists` });
        }
        console.error("registerStudent error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await ExamStudent.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        console.error("getAllStudents error:", error);
        res.status(500).json({ message: 'Error fetching students' });
    }
};

export const updateStudentStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const student = await ExamStudent.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(student);
    } catch (error) {
        console.error("updateStudentStatus error:", error);
        res.status(500).json({ message: 'Error updating status' });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        await ExamStudent.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student registration revoked successfully' });
    } catch (error) {
        console.error("deleteStudent error:", error);
        res.status(500).json({ message: 'Error deleting student' });
    }
};

export const verifyCertificate = async (req, res) => {
    try {
        const student = await ExamStudent.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json(student);
    } catch (error) {
        console.error("verifyCertificate error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyCertificatePublic = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await ExamStudent.findOne({ certificateId: id });
        
        if (!student) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        // Return only public safe info
        const safeData = {
            fullName: student.fullName,
            branch: student.branch,
            year: student.year,
            certificateId: student.certificateId,
            college: student.college
        };

        res.json(safeData);
    } catch (error) {
        console.error("verifyCertificatePublic error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendEmailCertificate = async (req, res) => {
    const { email, name, certificateImage } = req.body;
    if (!email || !certificateImage) {
      return res.status(400).json({ message: 'Missing email or certificate image' });
    }

    try {
      const sent = await sendCertificateEmail(email, name, certificateImage);
      if (sent) {
        res.status(200).json({ message: 'Email sent successfully' });
      } else {
        res.status(500).json({ message: 'Failed to send email.' });
      }
    } catch (error) {
      console.error("sendEmailCertificate error:", error);
      res.status(500).json({ message: 'Error in email process' });
    }
};

export const bulkRegister = async (req, res) => {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Invalid students list' });
    }

    try {
      const results = await ExamStudent.insertMany(students, { ordered: false });
      res.status(201).json({ message: `${results.length} students registered successfully`, count: results.length });
    } catch (error) {
      if (error.code === 11000 || error.writeErrors) {
          const successCount = error.result?.nInserted || 0;
          return res.status(207).json({ 
              message: `Partially succeeded. ${successCount} added, others were duplicates.`,
              successCount 
          });
      }
      console.error("bulkRegister error:", error);
      res.status(500).json({ message: 'Bulk registration failed' });
    }
};
