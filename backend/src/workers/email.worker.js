import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import ExamStudent from '../models/ExamStudent.js';
import { sendCertificateEmail } from '../utils/emailService.js';
import { generateCertificatePDF } from '../utils/pdfGenerator.js';

const REDIS_URL = process.env.REDIS_URL;

let connection;
let emailWorker;

export const processEmailJob = async (job) => {
        const { studentId, certificateImageUrl, score } = job.data;
        console.log(`📡 Processing Professional PDF Email for Student: ${studentId}`);

        try {
            const student = await ExamStudent.findById(studentId);
            if (!student) return;

            // Generate Professional PDF if no screenshot provided
            let pdfBuffer = null;
            if (!certificateImageUrl) {
                console.log(`📄 Generating PDF for ${student.fullName}...`);
                pdfBuffer = await generateCertificatePDF(student, student.certificateId || student.studentId).catch(e => {
                    console.error("PDF Fail:", e.message);
                    return null;
                });
            }

            // Wait 2 seconds to avoid being flagged as spam by Gmail SMTP spam filters
            await new Promise(r => setTimeout(r, 2000));

            const sent = await sendCertificateEmail(
                student.email, 
                student.fullName, 
                certificateImageUrl || null, 
                score || student.score,
                student.certificateId || student.studentId,
                pdfBuffer
            );
            
            if (sent) {
                console.log(`✅ Bulk Email Success: ${student.email}`);
            } else {
                console.error(`❌ Bulk Email Failed for ${student.email}`);
                throw new Error('SMTP Failure'); // Trigger retry
            }
        } catch (err) {
            console.error(`❌ Bulk Email Error for Student ${studentId}:`, err.message);
            throw err; // Trigger retry
        }
};

if (REDIS_URL) {
    connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => Math.min(times * 5000, 30000),
    });

    connection.on('error', (err) => {
        if (err.code !== 'ECONNREFUSED') {
            console.error('Email worker Redis error:', err.message);
        }
    });

    emailWorker = new Worker('bulk-email-delivery', processEmailJob, { 
        connection, 
        concurrency: 1, // DO NOT PARALLEL GMAIL - they block multi-connections
        limiter: {
            max: 25, // Max 25 emails
            duration: 60000 // Per minute (approx 1500 per hour)
        }
    });

    console.log('⚡ BullMQ: Email Delivery Worker Active (Throttled)');
}
