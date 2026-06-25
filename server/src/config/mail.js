const nodemailer = require("nodemailer");
console.log(process.env.EMAIL);
console.log(process.env.EMAIL_PASSWORD);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

module.exports = transporter;