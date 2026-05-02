const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
     // SSL for production
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      
      // CRITICAL: Forces IPv4 to resolve the ENETUNREACH error on Render
    
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
