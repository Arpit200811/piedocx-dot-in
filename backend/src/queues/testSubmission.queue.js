import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { processSubmissionJob } from '../workers/testSubmission.worker.js';

const REDIS_URL = process.env.REDIS_URL;

let connection;
export let submissionQueue = {
    add: async (_name, data) => {
        await processSubmissionJob({ data });
        return { id: `fallback_submit_${Date.now()}` };
    }
};

if (REDIS_URL) {
    connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });
    
    connection.on('error', () => { /* Quiet */ });

    submissionQueue = new Queue('test-submission-spike', {
        connection,
        defaultJobOptions: {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
            removeOnComplete: true,
            removeOnFail: false,
        }
    });
    console.log('📦 BullMQ: Submission Queue Initialized');
} else {
    console.warn('⚠️  Redis missing: Submission Queue in Fallback Mode (Synchronous)');
}
