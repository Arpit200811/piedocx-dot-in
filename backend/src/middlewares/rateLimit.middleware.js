import { initRedis } from '../utils/cacheService.js';

const redis = initRedis();

export const registrationRateLimiter = async (req, res, next) => {
  if (!redis || redis.status !== 'ready') {
    // Fallback if Redis is down
    return next();
  }

  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const key = `ratelimit:reg:${ip}`;
  const windowSecs = 15 * 60;
  const maxRequests = 500;

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSecs);
    }

    if (current > maxRequests) {
      return res.status(429).json({
        message: 'Too many registration attempts. Please try again after 15 minutes.'
      });
    }
    next();
  } catch (err) {
    console.error("Rate limit error:", err);
    next(); // Fallback: allow request if rate limiter fails
  }
};

export const apiRateLimiter = async (req, res, next) => {
  if (!redis || redis.status !== 'ready') return next();

  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const key = `ratelimit:api:${ip}`;
  const maxRequests = 100;

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, 60); // 1 minute window
    }

    if (current > maxRequests) {
      return res.status(429).json({
        message: 'Too many requests. Please slow down.'
      });
    }
    next();
  } catch (err) {
    next();
  }
};
