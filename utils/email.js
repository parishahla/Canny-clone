import { createTransport } from "nodemailer";

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Jonas Schmedtmann <hello@jonas.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;

// const nodemailer = require("nodemailer");
// const MAIL_HOST = process.env.MAIL_HOST;
// const MAIL_PORT = process.env.MAIL_PORT;
// const MAIL_USER = process.env.MAIL_USER;
// const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

// const transporter = nodemailer.createTransport({
//   host: MAIL_HOST,
//   port: MAIL_PORT,
//   tls: true,
//   auth: {
//     user: MAIL_USER,
//     pass: MAIL_PASSWORD,
//   },
// });

// transporter
//   .sendMail({
//     from: "MyName <from@example.com>",
//     to: "to@example.com",
//     subject: "Test Email Subject",
//     html: "<h1>Example HTML Message Body</h1>",
//   })
//   .then(() => console.log("OK, Email has been sent."))
//   .catch(console.error);
