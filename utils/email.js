// eslint-disable-next-line import/no-extraneous-dependencies
import { createTransport } from "nodemailer";

const sendEmail = async (options) => {
  const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    tls: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter
    .sendMail({
      from: "pari@e8i.ir",
      to: options.email,
      subject: options.subject,
      text: options.message,
    })
    .then(() => console.log("OK, Email has been sent."))
    .catch(console.error);
};

export default sendEmail;
