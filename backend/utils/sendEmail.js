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
    // Port 465 with secure: true is the most stable configuration for Gmail on Render
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL for port 465
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // Must be the 16-character App Password (no spaces)
      },
      tls: {
        // Essential for bypassing certain network restrictions on cloud providers
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
    // Detailed logging for debugging in the Render dashboard
    console.error("Nodemailer Error: ", error.message);
    throw new Error("Email could not be sent");
  }
};

// ==========================================
// 3. EXPORTS
// ==========================================
module.exports = sendEmail;
