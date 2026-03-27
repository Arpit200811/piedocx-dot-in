import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { processEmailJob } from '../workers/email.worker.js';

const REDIS_URL = process.env.REDIS_URL;

let connection;
export let isEmailQueueFallback = true;
export let emailQueue = {
    add: async (_name, data) => {
        await processEmailJob({ data });
        return { id: `fallback_email_${Date.now()}` };
    }
};

if (REDIS_URL) {
    connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });
    
    connection.on('error', () => { /* Quiet */ });

    emailQueue = new Queue('bulk-email-delivery', {
        connection,
        defaultJobOptions: {
            attempts: 5, // More attempts for email
            backoff: { type: 'exponential', delay: 1000 },
            removeOnComplete: true,
            removeOnFail: false,
        }
    });
    isEmailQueueFallback = false;
    console.log('📬 BullMQ: Email Delivery Queue Initialized');
} else {
    console.warn('⚠️  Redis missing: Bulk Email will run Synchronously (Slow)');
}
