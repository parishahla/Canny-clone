// eslint-disable-next-line import/no-extraneous-dependencies
import { createTransport } from "nodemailer";
//* Liara
// const { MAIL_HOST } = process.env;
// const { MAIL_PORT } = process.env;
// const { MAIL_USER } = process.env;
// const { MAIL_PASSWORD } = process.env;

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

// //* Jonas
const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "P Sh <parnianshahla2004@gmail.com>",
    to: options.email,
    text: options.message,
  };

  // 3) Actually send the email
  transporter.sendMail({ mailOptions });
};

export default sendEmail;
