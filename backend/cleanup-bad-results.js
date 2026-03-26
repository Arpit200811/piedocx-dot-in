import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import ExamStudent from './src/models/ExamStudent.js';
import TestResult from './src/models/TestResult.js';

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Find results with totalQuestions = 0
        const badResults = await TestResult.find({ totalQuestions: 0 });
        console.log(`Found ${badResults.length} invalid results (0/0 questions).`);

        if (badResults.length === 0) {
            console.log("Nothing to clean up.");
            process.exit(0);
        }

        const studentIds = badResults.map(r => r.student);

        // Remove the bad results
        const deleteRes = await TestResult.deleteMany({ totalQuestions: 0 });
        console.log(`Deleted ${deleteRes.deletedCount} records from TestResults.`);

        // Reset ExamStudent status for these students so they are no longer "Attempted" with 0 marks
        const updateRes = await ExamStudent.updateMany(
            { _id: { $in: studentIds } },
            { 
                $set: { 
                    testAttempted: false, 
                    score: 0, 
                    correctCount: 0, 
                    wrongCount: 0 
                } 
            }
        );
        console.log(`Reset status for ${updateRes.modifiedCount} students in ExamStudent collection.`);

        console.log("Cleanup finished successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Cleanup failed:", err);
        process.exit(1);
    }
}

cleanup();
