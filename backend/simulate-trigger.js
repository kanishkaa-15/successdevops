require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Admission = require('./models/Admission');
const Grade = require('./models/Grade');
const { sendPerformanceEmail } = require('./utils/emailService');

const simulateImport = async () => {
    try {
        await connectDB();

        // Pick a student who HAS an email
        const student = await Admission.findOne({ email: { $ne: 'N/A', $exists: true } });

        if (!student) {
            console.log('No student found with a valid email.');
            process.exit(0);
        }

        console.log(`Simulating import for: ${student.studentName} (${student.email})`);

        const subject = 'Mathematics';
        const score = 95;
        const gradeLetter = 'A+';

        console.log('Pushing to sendPerformanceEmail...');

        try {
            const info = await sendPerformanceEmail({
                parentEmail: student.email,
                studentName: student.studentName,
                subject,
                score,
                grade: gradeLetter,
                title: 'Simulation Test'
            });
            console.log('✅ sendPerformanceEmail execution completed.');
            if (info) console.log('Message ID:', info.messageId);
        } catch (emailErr) {
            console.error('❌ Error inside sendPerformanceEmail:', emailErr);
        }

        process.exit(0);
    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
};

simulateImport();
