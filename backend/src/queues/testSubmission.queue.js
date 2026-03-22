import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Connection shared by queue
const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null, // Critical for BullMQ
});

// Create a new queue for test submissions
export const submissionQueue = new Queue('test-submission-spike', {
    connection,
    defaultJobOptions: {
        attempts: 3, // Retry if DB is busy
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true, // Clean up to save Redis memory
        removeOnFail: false, // Keep failed for manual review
    }
});

console.log('📦 BullMQ: Submission Queue Initialized');
