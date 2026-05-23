const nodemailer = require("nodemailer");
const dns = require("dns");

// 1. GLOBAL DNS OVERRIDE: Forces Node 17+ to prioritize IPv4
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, 
      },
      // 2. NODEMAILER OVERRIDE: Tells Nodemailer to request IPv4
      family: 4,
      // 3. THE NUKE: Binds the connection directly to the local IPv4 interface
      localAddress: "0.0.0.0" 
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
