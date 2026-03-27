
import mongoose from 'mongoose';
import Admin from './src/models/admin.model.js';
import { config } from 'dotenv';
config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await Admin.findOne({ email: 'dev.adityakumar92@gmail.com'.toLowerCase() });
        console.log("Admin found:", admin ? "YES" : "NO");
        if (admin) {
           console.log("Admin ID:", admin._id);
           console.log("Admin Email:", admin.email);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
check();
