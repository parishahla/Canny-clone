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
    tls: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  // console.log(process.env.MAIL_USER);
  // console.log(process.env.MAIL_PASSWORD);
  // 2) Define the email options
  // const mailOptions = {
  //   from: "pari@e8i.ir",
  //   to: options.email,
  // };
  // 3) Actually send the email
  transporter
    .sendMail({
      from: "pari@e8i.ir",
      to: options.email,
      subject: options.subject,
      text: options.message,
    })
    .then(() => console.log("OK, Email has been sent."))
    .catch(console.error);

  // from: 'Jonas Schmedtmann <hello@jonas.io>',
  // to: options.email,
  // subject: options.subject,
  // text: options.message
  // transporter
  //   .sendMail({
  //     from: "Pari parnianshahla2004@gmail.com>",
  //     to: "to@example.com",
  //   })
  //   .then(() => console.log("OK, Email has been sent."))
  //   .catch(console.error);
};

export default sendEmail;
