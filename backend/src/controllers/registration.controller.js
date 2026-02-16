
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

        // Generate Sequential Student ID (Base: PDT-WS 2600) if not provided
        let studentId = req.body.studentId;
        if (!studentId) {
            const totalStudents = await ExamStudent.countDocuments();
            studentId = `PDT-WS ${26000 + totalStudents + 1}`;
        }

        // 1. Generate Unique Certificate ID
        const currentYear = new Date().getFullYear();
        const countForYear = await ExamStudent.countDocuments({ year: year });
        const certId = generateCertificateID(currentYear, countForYear + 1);

        // 2. Generate Signature
        const signature = generateCertificateSignature({
            studentId,
            course: branch,
            issueDate: new Date().toISOString().split('T')[0],
            score: 0 // Initial score
        });

        // 3. QR Code (Pointing to a verification URL with HashRouter support)
        const verifyUrl = `${process.env.FRONTEND_URL || 'https://piedocx.in'}/#/verify/${certId}`;
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
        
        // Send Welcome Email
        try {
            const { sendRegistrationEmail } = await import('../utils/mailer.js');
            sendRegistrationEmail(newStudent);
        } catch (mailErr) {
            console.error("Delayed mail error:", mailErr);
        }

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
        // Optimization: Select only necessary fields and exclude heavy fields like images/questions for the list view
        const students = await ExamStudent.find({}, {
            profilePicture: 0,
            qrCode: 0,
            signature: 0,
            assignedQuestions: 0,
            savedAnswers: 0
        }).sort({ createdAt: -1 });
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
        const student = await ExamStudent.findOne({ 
            $or: [
                { certificateId: id },
                { studentId: id }
            ]
        });
        
        if (!student) {
            return res.status(404).json({ message: 'Certificate or Student Record not found' });
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
      // Security: Check if this email exists in our student records to prevent spamming random emails
      const studentExists = await ExamStudent.findOne({ email });
      if (!studentExists) {
          // If not an admin, we only allow sending to registered students
          if (!req.admin) {
             return res.status(403).json({ message: 'Unauthorized email target' });
          }
      }

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

export const updateStudentDetails = async (req, res) => {
    const { id } = req.params;
    const { fullName, college, score, branch, year, mobile, email } = req.body;

    try {
        const student = await ExamStudent.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Strictly forbid editing name and college as per requirements
        if (fullName !== undefined || college !== undefined) {
            return res.status(400).json({ 
                message: 'Name and College cannot be edited for integrity. Please delete and re-register the student if these details are incorrect.' 
            });
        }

        const updateData = {};
        if (score !== undefined) updateData.score = score;
        if (branch !== undefined) updateData.branch = branch;
        if (year !== undefined) updateData.year = year;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (email !== undefined) updateData.email = email;

        // If sensitive fields change, we must regenerate the signature to maintain integrity
        const needsResign = updateData.branch !== undefined || updateData.score !== undefined;

        if (needsResign) {
            const tempStudent = { ...student.toObject(), ...updateData };
            updateData.signature = generateCertificateSignature({
                studentId: tempStudent.studentId,
                course: tempStudent.branch,
                issueDate: new Date(tempStudent.createdAt || Date.now()).toISOString().split('T')[0],
                score: tempStudent.score || 0
            });
            
            // Also regenerate QR to ensure everything is in sync
            const verifyUrl = `${process.env.FRONTEND_URL || 'https://piedocx.in'}/#/verify/${student.certificateId}`;
            updateData.qrCode = await generateQR(verifyUrl);
        }

        const updated = await ExamStudent.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        res.json({ message: 'Student details updated successfully', student: updated });
    } catch (error) {
        console.error("updateStudentDetails error:", error);
        res.status(500).json({ message: 'Update failed' });
    }
};

export const bulkRegister = async (req, res) => {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Invalid students list' });
    }

    try {
      const currentYear = new Date().getFullYear();
      let totalCount = await ExamStudent.countDocuments();
      const preparedStudents = [];
      for (let i = 0; i < students.length; i++) {
          const student = { ...students[i] };
          
          if (!student.studentId) {
              student.studentId = `PDT-WS ${26000 + totalCount + i + 1}`;
          }

          if (!student.certificateId) {
              const certId = generateCertificateID(currentYear, totalCount + i + 1);
              student.certificateId = certId;

              const verifyUrl = `${process.env.FRONTEND_URL || 'https://piedocx.in'}/#/verify/${certId}`;
              student.qrCode = await generateQR(verifyUrl);

              student.signature = generateCertificateSignature({
                  studentId: student.studentId,
                  course: student.branch,
                  issueDate: new Date().toISOString().split('T')[0],
                  score: student.score || 0
              });
          }
          preparedStudents.push(student);
      }

      const results = await ExamStudent.insertMany(preparedStudents, { ordered: false });
      res.status(201).json({ message: `${results.length} students registered successfully`, count: results.length });
    } catch (error) {
      if (error.code === 11000 || error.writeErrors) {
          const successCount = (error.result?.nInserted) || (error.insertedDocs?.length) || 0;
          return res.status(207).json({ 
              message: `Partially succeeded. ${successCount} added, others were duplicates.`,
              successCount 
          });
      }
      console.error("bulkRegister error:", error);
      res.status(500).json({ message: 'Bulk registration failed' });
    }
};

export const bulkDelete = async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided' });
    }

    try {
      await ExamStudent.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ message: 'Records deleted successfully' });
    } catch (error) {
      console.error("bulkDelete error:", error);
      res.status(500).json({ message: 'Bulk deletion failed' });
    }
};

export const bulkSendCertificates = async (req, res) => {
    const { ids } = req.body; // Array of Mongo IDs
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No students selected' });
    }

    try {
        const students = await ExamStudent.find({ _id: { $in: ids } });
        let successCount = 0;
        let failCount = 0;

        for (const student of students) {
            try {
                // Here we would ideally generate the image too, but since the frontend handles canvas, 
                // we'll keep the current simple email trigger or a placeholder for mass dispatch.
                // For now, let's assume this triggers the actual sendCertificateEmail utility.
                const sent = await sendCertificateEmail(student.email, student.fullName, null); // passing null as image just sends the link-based email template
                if (sent) successCount++;
                else failCount++;
            } catch (err) {
                failCount++;
            }
        }

        res.status(200).json({ 
            message: `Bulk processing complete.`, 
            summary: { total: students.length, succeeded: successCount, failed: failCount } 
        });
    } catch (error) {
        console.error("bulkSendCertificates error:", error);
        res.status(500).json({ message: 'Bulk email process failed' });
    }
};
