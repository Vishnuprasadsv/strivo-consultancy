const nodemailer = require("nodemailer");
console.log(process.env.EMAIL);
console.log(process.env.EMAIL_PASSWORD);
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 587,
  secure: false,
      tls: { rejectUnauthorized: false },
      family: 4,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

module.exports = transporter;