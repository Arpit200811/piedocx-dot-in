import jwt from 'jsonwebtoken';

// Admin Authentication Middleware
export const adminAuth = (req, res, next) => {
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
      console.warn(`[Auth] Admin Access Forbidden for user: ${decoded.email}`);
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error(`[Auth] Admin JWT Error: ${error.message}`);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Student Authentication Middleware
export const studentAuth = (req, res, next) => {
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
        console.warn(`[Auth] Student Access Forbidden for user: ${decoded.email}`);
        return res.status(403).json({ message: 'Access denied.' });
    }
    req.student = decoded;
    next();
  } catch (error) {
    console.error(`[Auth] Student JWT Error: ${error.message}`);
    res.status(401).json({ message: 'Session expired or invalid. Please relogin.' });
  }
};
