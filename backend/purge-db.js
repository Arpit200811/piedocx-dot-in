import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
import TestConfig from './src/models/TestConfig.js';

async function purgeOldConfigs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const now = new Date();
        const result = await TestConfig.deleteMany({
            endDate: { $lt: now }
        });

        console.log(`Successfully purged ${result.deletedCount} expired test configurations.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

purgeOldConfigs();
