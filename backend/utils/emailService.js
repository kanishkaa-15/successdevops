const nodemailer = require('nodemailer');

/**
 * Creates an SMTP transporter based on environment variables.
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

/**
 * Sends a performance report email to a parent.
 * @param {Object} data - Email data (parentEmail, studentName, subject, score, title)
 */
const sendPerformanceEmail = async (data) => {
    const { parentEmail, studentName, subject, score, grade, title } = data;

    if (!parentEmail || parentEmail === 'N/A') {
        console.warn(`Email Service: No valid email for student ${studentName}. Skipping notification.`);
        return;
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: parentEmail,
        subject: `Academic Performance Update - ${studentName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Academic Performance Update</h2>
        <p>Dear Parent,</p>
        <p>New marks have been released for <strong>${studentName}</strong>.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Assessment:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Score:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #059669; font-weight: bold;">${score}%</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Grade:</strong></td>
              <td style="padding: 8px 0; text-align: right; color: #4f46e5; font-weight: bold;">${grade}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">You can view the detailed breakdown and progress charts in the Parent Dashboard.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated message from the School CEO Dashboard. Please do not reply directly to this email.</p>
      </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email Service: Performance report sent for ${studentName} to ${parentEmail}. MessageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Email Service: Failed to send email to ${parentEmail}`, error);
        throw error;
    }
};

module.exports = { sendPerformanceEmail };
