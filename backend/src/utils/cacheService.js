import 'dotenv/config';
import Redis from 'ioredis';

// --- In-Memory Fallback Implementation ---
const memoryStorage = new Map();
const memoryExpirations = new Map();

const memoryCache = {
    status: 'ready',
    get: async (key) => {
        if (memoryExpirations.has(key) && memoryExpirations.get(key) < Date.now()) {
            memoryStorage.delete(key);
            memoryExpirations.delete(key);
            return null;
        }
        return memoryStorage.get(key) || null;
    },
    set: async (key, value, mode, ttl) => {
        memoryStorage.set(key, value);
        if (mode === 'EX' && ttl) {
            memoryExpirations.set(key, Date.now() + (ttl * 1000));
        }
        return 'OK';
    },
    del: async (key) => {
        memoryStorage.delete(key);
        memoryExpirations.delete(key);
        return 1;
    },
    incr: async (key) => {
        let val = parseInt(memoryStorage.get(key) || 0) + 1;
        memoryStorage.set(key, val.toString());
        return val;
    },
    expire: async (key, seconds) => {
        if (memoryStorage.has(key)) {
            memoryExpirations.set(key, Date.now() + (seconds * 1000));
            return 1;
        }
        return 0;
    }
};
// ---------------------------------------

let redisClient = null;
let isRedisAvailable = false;
let hasLoggedStatus = false;
const isTestRuntime = process.env.NODE_ENV === 'test' || process.argv.includes('--test');

export const initRedis = () => {
    if (isTestRuntime) {
        return memoryCache;
    }
    const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

    if (!redisClient) {
        if (!hasLoggedStatus) {
            const host = REDIS_URL.split('@')[1] || REDIS_URL;
            const cleanHost = host.split(':')[0].replace('//', '');
            console.log(`[Redis] Connecting to Cloud: ${cleanHost}...`);
        }
        redisClient = new Redis(REDIS_URL, {
            keyPrefix: 'piedocx:', 
            retryStrategy: (times) => {
                // If it's a default local connection and fails once, stop retrying or slow down massively
                if (!process.env.REDIS_URL && times > 1) {
                    return null; // Stop retrying local redis if not found
                }
                return Math.min(times * 10000, 60000); // Slower retry for cloud
            },
            maxRetriesPerRequest: 0,
            enableOfflineQueue: false,
            connectTimeout: 5000,
            showFriendlyErrorStack: false
        });

        redisClient.on('connect', () => {
            if (!hasLoggedStatus || !isRedisAvailable) {
                console.log('✅ Redis Connected Successfully');
                isRedisAvailable = true;
                hasLoggedStatus = true;
            }
        });

        redisClient.on('error', (err) => {
            isRedisAvailable = false;
            if (!hasLoggedStatus) {
                console.log('ℹ️  Redis not found. Switching to high-performance In-Memory Cache.');
                hasLoggedStatus = true;
            }
        });
    }
    
    // Always return a client-like object
    // Proxy logic: if Redis is available, use it. Otherwise, use memoryCache.
    return new Proxy(redisClient, {
        get: (target, prop) => {
            if (isRedisAvailable && typeof target[prop] === 'function') {
                return target[prop].bind(target);
            }
            if (memoryCache[prop]) {
                return memoryCache[prop];
            }
            return target[prop];
        }
    });
};

// Helper functions using the initialized client
const getClient = () => initRedis();

export const getCache = async (key) => {
    try {
        const data = await getClient().get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        return null;
    }
};

export const setCache = async (key, value, ttlSeconds = 3600) => {
    try {
        await getClient().set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
        // Fail silently
    }
};

export const delCache = async (key) => {
    try {
        await getClient().del(key);
    } catch (err) {
        // Fail silently
    }
};

export default isTestRuntime ? memoryCache : initRedis();
