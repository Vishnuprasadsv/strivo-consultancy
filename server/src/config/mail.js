const nodemailer = require("nodemailer");
console.log(process.env.EMAIL);
console.log(process.env.EMAIL_PASSWORD);
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 465,
  secure: true,
      tls: { rejectUnauthorized: false },
      family: 4,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

module.exports = transporter;