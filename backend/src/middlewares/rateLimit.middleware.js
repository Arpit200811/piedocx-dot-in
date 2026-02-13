const rateLimitMap = new Map();

export const registrationRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10; // 10 registrations per 15 mins

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const rateData = rateLimitMap.get(ip);

  if (now > rateData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (rateData.count >= maxRequests) {
    return res.status(429).json({ 
      message: 'Too many registration attempts. Please try again after 15 minutes.',
      retryAfter: Math.ceil((rateData.resetTime - now) / 1000)
    });
  }

  rateData.count += 1;
  next();
};
