const cron = require('node-cron');
const Admission = require('../models/Admission');
const Query = require('../models/Query');
const Staff = require('../models/Staff');
const AuditLog = require('../models/AuditLog');
const connectDB = require('../config/database');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

let io;

/**
 * Initialize Socket.io instance for the service
 * @param {Object} socketIo 
 */
function init(socketIo) {
    io = socketIo;
    console.log('ReportService: Socket.io initialized');
}

/**
 * Generates an Institutional Health Report PDF.
 * @param {string} userId - ID of the user triggering the report (optional)
 * @param {string} endpoint - The endpoint or source of the trigger (optional)
 */
async function generateHealthReport(userId = '60d5ecb8b392d700153ee000', endpoint = 'cron-job') {
    console.log(`Generating Institutional Health Report (Trigger: ${endpoint})...`);

    try {
        await connectDB();
        const admissionCount = await Admission.countDocuments();
        const openQueries = await Query.countDocuments({ status: 'Open' });
        const staffCount = await Staff.countDocuments();
        const activeStaff = await Staff.countDocuments({ status: 'Active' });

        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(0, 51, 102);
        doc.text('Institutional Health Report', 20, 30);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);
        doc.line(20, 45, 190, 45);

        // Stats Section
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('Summary Statistics', 20, 60);

        doc.setFontSize(12);
        doc.text(`Total Admissions Managed: ${admissionCount}`, 30, 75);
        doc.text(`Current Open Parent Queries: ${openQueries}`, 30, 85);
        doc.text(`Total Staff Records: ${staffCount}`, 30, 95);
        doc.text(`Active Faculty: ${activeStaff}`, 30, 105);

        // Save report
        const reportsDir = path.join(__dirname, '../reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        const fileName = `HealthReport_${Date.now()}.pdf`;
        const filePath = path.join(reportsDir, fileName);
        doc.save(filePath);

        console.log(`Report generated successfully: ${filePath}`);

        // 🛡️ SECURITY: Log the action
        await AuditLog.create({
            userId,
            action: 'GENERATED_REPORT',
            endpoint,
            ipAddress: 'Internal/Server',
            details: {
                generatedPath: filePath,
                fileName,
                automated: endpoint === 'cron-job'
            }
        });

        // 🚀 REAL-TIME: Emit event
        if (io) {
            io.emit('report_generated', {
                message: endpoint === 'cron-job' ? 'Weekly health report generated automatically' : 'Health report generated successfully',
                fileName,
                timestamp: new Date()
            });
            console.log('ReportService: Socket event emitted');
        }

        return filePath;
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

// Schedule automated reports (Sunday at Midnight)
cron.schedule('0 0 * * 0', async () => {
    generateHealthReport();
});

/**
 * Generates an Annual Executive Strategic Report PDF.
 * @param {string} userId - ID of the user triggering the report
 * @param {string} endpoint - The source of the trigger
 */
async function generateAnnualExecutiveReport(userId, endpoint = 'manual-trigger') {
    console.log(`Generating Annual Executive Strategic Report (Trigger: ${endpoint})...`);

    try {
        await connectDB();
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

        // Fetch Data for Aggregation
        const grades = await Grade.find({ date: { $gte: oneYearAgo } });
        const attendance = await Attendance.find({ date: { $gte: oneYearAgo } });
        const admissions = await Admission.find({ createdAt: { $gte: oneYearAgo } });

        const doc = new jsPDF();

        // Premium Header
        doc.setFillColor(15, 23, 42); // slate-950
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text('ANNUAL STRATEGIC SUMMARY', 20, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`ACADEMIC YEAR: ${oneYearAgo.getFullYear()} - ${now.getFullYear()} | GENERATED: ${new Date().toLocaleString()}`, 20, 32);

        // 1. Academic Performance Summary
        doc.setTextColor(0);
        doc.setFontSize(16);
        doc.text('1. Academic Excellence Trend', 20, 60);

        const avgTotalScore = grades.length > 0
            ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
            : 'N/A';

        doc.setFontSize(12);
        doc.text(`Rolling 12-Month Proficiency Average: ${avgTotalScore}%`, 30, 70);
        doc.text(`Total Assessments Evaluated: ${grades.length}`, 30, 80);

        // 2. Operational Vitality (Attendance)
        doc.setFontSize(16);
        doc.text('2. Operational Vitality (Attendance)', 20, 100);

        const presenceCount = attendance.filter(a => a.status === 'Present').length;
        const totalAtt = attendance.length;
        const avgAttendance = totalAtt > 0 ? ((presenceCount / totalAtt) * 100).toFixed(1) : 'N/A';

        doc.setFontSize(12);
        doc.text(`Annual Cumulative Attendance Rate: ${avgAttendance}%`, 30, 110);
        doc.text(`System Log Integrity: ${totalAtt} events captured`, 30, 120);

        // 3. Enrollment & Growth
        doc.setFontSize(16);
        doc.text('3. Enrollment Velocity & Growth', 20, 140);

        const approvedCount = admissions.filter(a => ['Approved', 'Paid', 'Enrolled'].includes(a.status)).length;

        doc.setFontSize(12);
        doc.text(`New Strategic Enrollments: ${approvedCount}`, 30, 150);
        doc.text(`Total Application Throughput: ${admissions.length}`, 30, 160);

        // Footer Security
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('This is a dynamically generated executive summary intended for CEO-level strategic review.', 20, 280);

        // Save report
        const reportsDir = path.join(__dirname, '../reports');
        if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

        const fileName = `AnnualReport_${Date.now()}.pdf`;
        const filePath = path.join(reportsDir, fileName);
        doc.save(filePath);

        // Notify via Socket
        if (io) {
            io.emit('report_generated', {
                message: 'Annual Executive Strategic Report generated successfully',
                fileName,
                timestamp: new Date()
            });
        }

        return filePath;
    } catch (error) {
        console.error('Error generating annual report:', error);
        throw error;
    }
}

module.exports = { generateHealthReport, generateAnnualExecutiveReport, init };
