import mongoose from 'mongoose';
import Admin from './src/models/admin.model.js';
import crypto from 'crypto';
import { config } from 'dotenv';
import { promisify } from 'util';

config();

const scryptAsync = promisify(crypto.scrypt);

const generatePasswordHash = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${Buffer.from(derived).toString('hex')}`;
};

const createAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "Piedocx Admin";

    if (!MONGO_URI || !email || !password) {
      throw new Error('MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD are required');
    }

    await mongoose.connect(MONGO_URI);

    const hashedPassword = await generatePasswordHash(password);

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log("✅ Admin updated successfully!");
    } else {
      await Admin.create({ name, email, password: hashedPassword });
      console.log("✅ Admin created successfully!");
    }

    console.log("----------------------------");
    console.log("Admin Email: " + email);
    console.log("----------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
