import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ExamStudent from './src/models/ExamStudent.js';
import TestConfig from './src/models/TestConfig.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const configs = await TestConfig.find({ isActive: true });
        console.log('Active TestConfigs:', configs.length);
        configs.forEach(c => {
            console.log(`- ${c.title} (${c._id})`);
            console.log(`  Dates: ${c.startDate} to ${c.endDate}`);
            console.log(`  YearGroup: ${c.yearGroup}, BranchGroup: ${c.branchGroup}, TargetCollege: ${c.targetCollege}`);
            console.log(`  Questions: ${c.questions.length}`);
        });

        const now = new Date();
        console.log('Current Server Time (ISO):', now.toISOString());
        console.log('Current Server Time (Local):', now.toString());

        const students = await ExamStudent.find({}).sort({ createdAt: -1 }).limit(5);
        console.log('\nLatest 5 Students:');
        students.forEach(s => {
            console.log(`- ${s.fullName} (${s.email})`);
            console.log(`  Year: ${s.year}, Branch: ${s.branch}, College: ${s.college}`);
            console.log(`  TestAttempted: ${s.testAttempted}`);
            console.log(`  AssignedQuestions: ${s.assignedQuestions?.length}`);
            console.log(`  CreatedAt: ${s.createdAt}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
