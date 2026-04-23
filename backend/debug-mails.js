const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Admission = require('./models/Admission');
const Grade = require('./models/Grade');

const debugMails = async () => {
    try {
        await connectDB();

        // Find latest grades from Excel Sync
        const latestGrades = await Grade.find({ title: 'Excel Sync' })
            .sort({ date: -1 })
            .limit(10);

        if (latestGrades.length === 0) {
            console.log('No Excel Sync grades found.');
            process.exit(0);
        }

        console.log(`Checking ${latestGrades.length} latest grades...`);

        for (const grade of latestGrades) {
            console.log(`\nGrade: ${grade.subject} for ${grade.studentName} (ID: ${grade.studentId})`);

            // Try to find the student in Admission
            const student = await Admission.findOne({
                $or: [
                    { studentId: grade.studentId },
                    { studentName: { $regex: new RegExp(`^${grade.studentName}$`, 'i') } }
                ]
            });

            if (!student) {
                console.log('  ❌ Student NOT FOUND in Admission collection.');
            } else {
                console.log(`  ✅ Student found: ${student.studentName}`);
                console.log(`  📧 Email: ${student.email}`);
                if (student.email === 'N/A' || !student.email) {
                    console.log('  ⚠️ Skipping: Email is N/A or missing.');
                } else {
                    console.log('  🚀 This SHOULD have triggered an email.');
                }
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugMails();
