const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL for production
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, 
      },
      // CRITICAL: Forces IPv4 to resolve the ENETUNREACH error on Render
      family: 4 
    });

    const mailOptions = {
      from: `Task Orbit <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    
  } catch (error) {
    console.error("Nodemailer Error: ", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;