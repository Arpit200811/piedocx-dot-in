import mongoose from 'mongoose';
import { config } from 'dotenv';
import Admin from './src/models/admin.model.js';
config();

async function listAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const admins = await Admin.find().select('name email password');
        console.log("--- ADMINS ---");
        admins.forEach((admin, i) => {
            console.log(`[${i}] Name: ${admin.name}, Email: ${admin.email}, Password: ${admin.password}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listAdmins();
