// ==========================================
// 1. DEPENDENCIES
// ==========================================
const nodemailer = require("nodemailer");

// ==========================================
// 2. EMAIL SERVICE UTILITY
// ==========================================
const sendEmail = async (options) => {
  // --- A. Configure Transporter ---
  // Tells Nodemailer how to connect to your email provider (e.g., Gmail, SendGrid)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // Use an App Password if using Gmail!
    },
  });

  // --- B. Construct Email Payload ---
  const mailOptions = {
    from: `Task Manager <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // --- C. Send Email ---
  await transporter.sendMail(mailOptions);
};

// ==========================================
// 3. EXPORTS
// ==========================================
module.exports = sendEmail;