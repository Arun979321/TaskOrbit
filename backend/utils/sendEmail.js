const nodemailer = require("nodemailer");
const dns = require("dns");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 10000,
      family: 4, // Force IPv4
      tls: {
        rejectUnauthorized: false,
      },
      getSocket: (options, callback) => {
        options.lookup = dns.lookup;
        callback(null, false);
      },
    });

    const mailOptions = {
      from: `Task Orbit <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
