import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  try {
    if (!process.env.SECRET_KEY) {
      console.error("CRITICAL ERROR: SECRET_KEY is not defined in environment variables.");
      return res.status(500).json({ message: "Server configuration error." });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const studentAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'student') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    req.student = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session expired or invalid. Please relogin.' });
  }
};
