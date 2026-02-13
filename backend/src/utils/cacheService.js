
import Redis from 'ioredis';

// Use environment variables for Redis connection
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let redisClient = null;
let isRedisAvailable = false;
let hasLoggedError = false;

export const initRedis = () => {
    if (!redisClient) {
        redisClient = new Redis(REDIS_URL, {
            retryStrategy: (times) => {
                // Exponential backoff up to 10 seconds, then constant
                // This keeps the connection alive for potential reconnections but doesn't spam
                const delay = Math.min(times * 2000, 10000); 
                return delay;
            },
            maxRetriesPerRequest: 0, // Fail immediately if not connected, don't queue
            enableOfflineQueue: false // Prevent memory leaks for queued commands when offline
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis Connected');
            isRedisAvailable = true;
            hasLoggedError = false;
        });

        redisClient.on('error', (err) => {
            isRedisAvailable = false;
            // Only log the error ONCE to prevent console spam
            if (!hasLoggedError) {
                if (err.code === 'ECONNREFUSED') {
                    console.log('⚠️ Redis disconnected. Caching disabled (running in fallback mode).');
                } else {
                    console.error('❌ Redis Error:', err.message);
                }
                hasLoggedError = true;
            }
        });
    }
    return redisClient;
};

// Helper to check if we can use Redis
const isReady = () => redisClient && isRedisAvailable && redisClient.status === 'ready';

export const getCache = async (key) => {
    if (!isReady()) return null;
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        // Silently fail on cache errors to keep app running
        return null;
    }
};

export const setCache = async (key, value, ttlSeconds = 3600) => {
    if (!isReady()) return;
    try {
        await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
        // Silently fail
    }
};

export const delCache = async (key) => {
    if (!isReady()) return;
    try {
        await redisClient.del(key);
    } catch (err) {
        // Silently fail
    }
};

export default redisClient;
