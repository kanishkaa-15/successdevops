require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing SMTP Configuration...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);
    console.log('Pass:', process.env.SMTP_PASS ? '********' : 'MISSING');
    console.log('From:', process.env.EMAIL_FROM);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('Connection verified successfully!');

        console.log('Sending test email to', process.env.SMTP_USER);
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.SMTP_USER,
            subject: 'SMTP Test - School CEO Dashboard',
            text: 'This is a test email to verify SMTP settings.',
            html: '<b>This is a test email to verify SMTP settings.</b>',
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('SMTP Error:', error);
    }
};

testEmail();
