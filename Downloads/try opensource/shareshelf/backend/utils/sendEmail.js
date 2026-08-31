const nodemailer = require('nodemailer');

// Create transporter - using console.log fallback if no SMTP config
const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Mock transporter - logs to console
  return {
    sendMail: async (mailOptions) => {
      console.log('📧 Email (Mock):', {
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
      });
      return { messageId: 'mock-' + Date.now() };
    },
  };
};

const transporter = createTransporter();

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@shareshelf.com',
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

module.exports = { sendEmail };
