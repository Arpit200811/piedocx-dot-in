import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
import TestConfig from './src/models/TestConfig.js';

async function listConfigs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const configs = await TestConfig.find().sort({ createdAt: -1 });
        console.log("--- TEST CONFIGURATIONS ---");
        configs.forEach((c, i) => {
            console.log(`[${i}] ID: ${c._id}, Title: ${c.title}, Group: ${c.yearGroup}/${c.branchGroup}, Start: ${c.startDate}, End: ${c.endDate}, Active: ${c.isActive}, Created: ${c.createdAt}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listConfigs();
