import mongoose from 'mongoose';
import Admin from './src/models/admin.model.js';
import crypto from 'crypto';
import { config } from 'dotenv';

config();

const MONGO_URI = "mongodb+srv://piedocxtechnologies:PiedocxTechnologies3174@piedocx.cuusxds.mongodb.net/Piedocx_in?retryWrites=true&w=majority&appName=piedocx";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    const email = "admin@piedocx.in";
    const password = "admin123"; 
    const name = "Piedocx Admin";

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

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
    console.log("Admin Password: " + password);
    console.log("----------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
