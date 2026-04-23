const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Admission = require('./models/Admission');
const Grade = require('./models/Grade');

const checkData = async () => {
    try {
        await connectDB();
        console.log('--- Admission Sample ---');
        const admissions = await Admission.find().sort({ createdAt: -1 }).limit(5);
        admissions.forEach(a => {
            console.log(`Student: ${a.studentName}, Email: ${a.email}, ID: ${a.studentId}`);
        });

        console.log('\n--- Grade Sample (Excel Sync) ---');
        const grades = await Grade.find({ title: 'Excel Sync' }).sort({ date: -1 }).limit(5);
        grades.forEach(g => {
            console.log(`Student: ${g.studentName}, Subject: ${g.subject}, Score: ${g.score}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
