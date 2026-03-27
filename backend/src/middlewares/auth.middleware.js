import jwt from 'jsonwebtoken';

// Admin Authentication Middleware
export const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  try {
    const secret = process.env.SECRET_KEY;
    if (!secret) {
      console.error("[Auth] CRITICAL: SECRET_KEY is missing in .env");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const decoded = jwt.verify(token, secret);
    
    if (decoded.role !== 'admin') {
      console.warn(`[Auth] Admin Access Forbidden for user: ${decoded.email}. Role found: ${decoded.role}`);
      return res.status(403).json({ message: `Access denied. Administrator privileges required. Found role: ${decoded.role}` });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.warn(`[Auth] Admin Session Info: ${error.message}`);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Student Authentication Middleware
export const studentAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please login again.' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("[Auth] CRITICAL: JWT_SECRET is missing in .env");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const decoded = jwt.verify(token, secret);
    if (decoded.role !== 'student') {
        console.warn(`[Auth] Student Access Forbidden for user: ${decoded.email}. Role found: ${decoded.role}`);
        return res.status(403).json({ message: `Access denied. Role: ${decoded.role}` });
    }

    // Verify student exists, is active, and session is valid (Item #11)
    const ExamStudent = (await import('../models/ExamStudent.js')).default;
    const student = await ExamStudent.findById(decoded.id).select('status currentSessionId');
    if (!student) {
        return res.status(401).json({ message: 'User record not found.' });
    }
    if (student.status === 'revoked') {
        return res.status(403).json({ message: 'Access revoked. Contact administrator.' });
    }

    // MULTI-DEVICE LOGIN PROTECTION: Kick oldest session if SID doesn't match
    if (decoded.sid && student.currentSessionId && decoded.sid !== student.currentSessionId) {
        console.warn(`[Auth] Session Overridden for: ${decoded.email}. New SID: ${student.currentSessionId}, Old SID: ${decoded.sid}`);
        return res.status(401).json({ 
            message: 'Session overtaken by another device. Only one device allowed.',
            override: true
        });
    }

    req.student = decoded;
    next();
  } catch (error) {
    console.warn(`[Auth] Student Session Info: ${error.message}`);
    res.status(401).json({ message: 'Session expired or invalid. Please relogin.' });
  }
};
