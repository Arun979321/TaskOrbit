const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("Email sent:", response);
    return response;

  } catch (error) {
    console.error("Resend Error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
