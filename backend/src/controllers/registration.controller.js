
import ExamStudent from '../models/ExamStudent.js';
import { generateCertificateID, generateCertificateSignature, generateQR } from '../utils/certUtils.js';
import { sendCertificateEmail } from '../utils/emailService.js';


// Helper: Auto-derive technology based on branch and year logic
const deriveTechnology = (branch, year) => {
    const b = (branch || '').toUpperCase();
    const y = (year || '').toLowerCase();
    const isJunior = y.includes('1') || y.includes('2');

    if (b.includes('CS') || b.includes('IT') || b.includes('COMPUTER') || b.includes('INFORMATION') || b.includes('AI') || b.includes('DATA')) {
        return isJunior ? "Python With Gen-AI" : "Placement Drive Assessment";
    }

    if (b.includes('EC') || b.includes('EE') || b.includes('ME') || b.includes('IC') || b.includes('ELECTRONIC') || b.includes('MECHANICAL') || b.includes('ELECTRICAL') || b.includes('CIVIL') || b.includes('AUTO')) {
        return isJunior ? "Automation controlling Rover" : "Placement Drive Assessment";
    }

    return branch; // Default fallback
};

export const registerStudent = async (req, res) => {
    try {
        const { fullName, branch, year, mobile, email, college, profilePicture } = req.body;

        // 1. Validation (Request Scoped)
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

        if (!validBranches.includes(branch) || !validYears.includes(year)) {
            return res.status(400).json({ message: 'Invalid branch or year selection.' });
        }

        // 2. Generate Isolated Identification (Atomic)
        // We use a timestamp + random salt to ensure studentId is unique even in parallel requests
        const salt = Math.floor(1000 + Math.random() * 9000);
        const studentId = `PDCX-S${Date.now().toString().slice(-6)}${salt}`;
        
        const currentYear = new Date().getFullYear();
        const certId = generateCertificateID(currentYear);

        const tech = req.body.technology || deriveTechnology(branch, year);

        // 3. Prepare State (No global variables)
        const signature = generateCertificateSignature({
            studentId,
            course: branch,
            issueDate: new Date().toISOString().split('T')[0],
            score: 0
        });

        const verifyUrl = `${process.env.FRONTEND_URL || 'https://piedocx.in'}/#/verify/${certId}`;
        const qrCode = await generateQR(verifyUrl);

        const newStudent = new ExamStudent({
            fullName,
            studentId,
            certificateId: certId,
            college: college.trim().toLowerCase(),
            branch,
            year,
            mobile: mobile.trim(),
            email: email.trim().toLowerCase(),
            profilePicture,
            technology: tech,
            signature,
            qrCode
        });

        // 4. Atomic Save
        // MongoDB unique indexes will prevent cross-user data duplication/overwriting
        await newStudent.save();
        
        // 5. Background Tasks (Non-blocking)
        try {
            const { sendRegistrationEmail } = await import('../utils/mailer.js');
            sendRegistrationEmail(newStudent);
        } catch (mailErr) {
            console.error("[Worker] Mail failed:", mailErr.message);
        }

        return res.status(201).json({ message: 'Registration Successful', student: newStudent });

    } catch (error) {
        // Handle MongoDB Duplicate Key Error (Atomic check fallback)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ 
                message: `The ${field} is already registered. Please use different details or login.` 
            });
        }
        console.error("[Registration Critical] Flow Error:", error);
        res.status(500).json({ message: 'A registration error occurred. Please try again.' });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const { search, college, startDate, endDate } = req.query;

        const query = {};

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { fullName: searchRegex },
                { studentId: searchRegex },
                { email: searchRegex },
                { mobile: searchRegex }
            ];
        }

        if (college) {
            query.college = college;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59));
        }

        // Optimization: Select only necessary fields
        const students = await ExamStudent.find(query, {
            profilePicture: 0,
            qrCode: 0,
            signature: 0,
            assignedQuestions: 0,
            savedAnswers: 0
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        const total = await ExamStudent.countDocuments(query);
        const uniqueColleges = await ExamStudent.distinct('college');

        res.json({
            students,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalStudents: total,
            colleges: uniqueColleges
        });
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
    // We now fetch name directly from DB using authenticated ID
    // We only take the image from body
    const { certificateImage } = req.body;
    
    if (!certificateImage) {
      return res.status(400).json({ message: 'Missing certificate image' });
    }

    try {
      // Security: Fetch student data directly from DB using JWT-authenticated ID
      // This ensures the certificate name is strictly what's in our records.
      const student = await ExamStudent.findById(req.student.id);
      
      if (!student) {
          return res.status(404).json({ message: 'Student record not found' });
      }

      if (student.status === 'revoked') {
          return res.status(403).json({ message: 'Access revoked' });
      }

      // Generate a unique identifier for this specific generation event
      const generationId = `${student._id}_${Date.now()}`;
      console.log(`[Certificate] Generating for ${student.fullName} (Ref: ${generationId})`);

      const sent = await sendCertificateEmail(student.email, student.fullName, certificateImage);
      
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
    const { fullName, college, score, branch, year, mobile, email, technology } = req.body;

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
        if (technology !== undefined) updateData.technology = technology;

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
          const raw = students[i];
          const student = { ...raw };
          
          // Field mapping & cleaning
          student.fullName = (raw.fullName || raw.name || raw.FullName || '').trim();
          student.email = (raw.email || raw.Email || '').trim().toLowerCase();
          student.mobile = String(raw.mobile || raw.phone || raw.Mobile || '').trim();
          student.branch = (raw.branch || raw.Branch || 'Computer Science & Engineering (CSE)').trim();
          student.year = (raw.year || raw.Year || '3rd Year').trim();
          student.college = (raw.college || raw.College || '').trim();
          
          // Auto-derive technology if not provided in bulk json
          const rawTech = (raw.technology || raw.Technology || '').trim();
          student.technology = rawTech || deriveTechnology(student.branch, student.year);
          
          // Date mapping (Optional: if provided in JSON, override default createdAt)
          const providedDate = raw.date || raw.Date || raw.regDate || raw.createdAt;
          if (providedDate) {
              const parsedDate = new Date(providedDate);
              if (!isNaN(parsedDate.getTime())) {
                  student.createdAt = parsedDate;
              }
          }

          // Strict validation for required fields
          if (!student.fullName) {
              return res.status(400).json({ message: `Student [Row ${i + 1}]: Full Name is missing.` });
          }
          if (!student.email || !student.email.includes('@')) {
              return res.status(400).json({ message: `Student [Row ${i + 1}]: Valid Email is missing.` });
          }
          if (!student.mobile || student.mobile === "undefined" || student.mobile.length < 10) {
              return res.status(400).json({ message: `Student [Row ${i + 1}]: Valid 10-digit mobile number is required.` });
          }
          if (!student.college) {
              return res.status(400).json({ message: `Student [Row ${i + 1}]: College name is required.` });
          }
          
          if (!student.studentId) {
              const salt = Math.floor(1000 + Math.random() * 9000);
              student.studentId = `PDCX-B${Date.now().toString().slice(-6)}${i}${salt}`;
          }

          if (!student.certificateId) {
              student.certificateId = generateCertificateID(currentYear);

              const verifyUrl = `${process.env.FRONTEND_URL || 'https://piedocx.in'}/#/verify/${student.certificateId}`;
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
      return res.status(201).json({ message: `${results.length} students registered successfully`, count: results.length });
    } catch (error) {
      if (error.code === 11000 || error.writeErrors) {
          const successCount = (error.result?.nInserted) || (error.insertedDocs?.length) || 0;
          return res.status(207).json({ 
              message: `Partially succeeded. ${successCount} added, others were duplicates.`,
              successCount 
          });
      }
      console.error("[Bulk Crashing] Error:", error);
      res.status(500).json({ message: 'Bulk registration failed due to data inconsistency.' });
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
                // Rate limiting to avoid SMTP rejection (1 email per second)
                await new Promise(r => setTimeout(r, 1000));
                
                const sent = await sendCertificateEmail(student.email, student.fullName, null, student.score); 
                if (sent) successCount++;
                else failCount++;
            } catch (err) {
                console.error(`[Bulk Mail] Failed for ${student.email}:`, err.message);
                failCount++;
            }
        }

        return res.status(200).json({ 
            message: `Bulk processing complete.`, 
            summary: { total: students.length, succeeded: successCount, failed: failCount } 
        });
    } catch (error) {
        console.error("bulkSendCertificates error:", error);
        res.status(500).json({ message: 'Bulk email process failed' });
    }
};

export const sendSingleEmailAdmin = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Student ID required' });

    try {
        const student = await ExamStudent.findById(id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const sent = await sendCertificateEmail(student.email, student.fullName, null, student.score);
        if (sent) {
            res.status(200).json({ message: `Certificate and score (${student.score}) sent to ${student.email}` });
        } else {
            res.status(500).json({ message: 'Failed to send email. Check SMTP settings.' });
        }
    } catch (error) {
        console.error("sendSingleEmailAdmin error:", error);
        res.status(500).json({ message: 'Email process failed' });
    }
};
