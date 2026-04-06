// ==========================================
// 1. DEPENDENCIES
// ==========================================
const nodemailer = require("nodemailer");

// ==========================================
// 2. EMAIL SERVICE UTILITY
// ==========================================
const sendEmail = async (options) => {
  try {
    // --- A. Configure Transporter ---
    // Using host/port 587 is more reliable on Render/Cloud than Port 465
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Must be false for port 587
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // Ensure this is a 16-character App Password
      },
      tls: {
        // This helps bypass network restrictions on some cloud providers
        rejectUnauthorized: false, 
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
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    
  } catch (error) {
    console.error("Nodemailer Error: ", error.message);
    throw new Error("Email could not be sent");
  }
};

// ==========================================
// 3. EXPORTS
// ==========================================
module.exports = sendEmail;