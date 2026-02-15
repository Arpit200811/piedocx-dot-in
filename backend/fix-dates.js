import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
import TestConfig from './src/models/TestConfig.js';

async function fixDates() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const farFuture = new Date();
        farFuture.setFullYear(farFuture.getFullYear() + 1);

        const result = await TestConfig.updateMany(
            {}, 
            { 
                $set: { 
                    startDate: new Date(), 
                    endDate: farFuture,
                    isActive: true 
                } 
            }
        );

        console.log(`Updated ${result.modifiedCount} tests to be live until ${farFuture.toLocaleDateString()}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixDates();
