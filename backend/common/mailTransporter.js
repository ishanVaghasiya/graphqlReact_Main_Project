const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "divyanshu.baranwal@gainserv.com",
    pass: "Divyanshu@9210",
  },
});
async function sendMail(email, otp, subject) {
  const details = {
    from: "support@gainserv.com",
    to: email,
    subject: subject,
    html: `<a style="color:red; font-size:30px;">${otp}</a>`,
  };

  try {
    const mailTransportResponse = await transporter.sendMail(details);
    return { mailTransportResponse, status: true };
  } catch (error) {
    return {
      mailTransportResponse: error.message,
      status: false,
    };
  }
}

module.exports = {
  sendMail,
};
