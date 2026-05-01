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
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL for port 465
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // Ensure 16-char App Password (no spaces)
      },
      tls: {
        rejectUnauthorized: false, 
      },
      // CRITICAL: Forces IPv4 to resolve the ENETUNREACH error on Render
      family: 4 
    });

    // --- B. Construct Email Payload ---
    const mailOptions = {
      from: `Task Orbit <${process.env.EMAIL_FROM}>`, // Updated name to match your project
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // --- C. Send Email ---
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    
  } catch (error) {
    // Detailed logging for the Render dashboard
    console.error("Nodemailer Error: ", error.message);
    throw new Error("Email could not be sent");
  }
};

// ==========================================
// 3. EXPORTS
// ==========================================
module.exports = sendEmail;
