// eslint-disable-next-line import/no-extraneous-dependencies
import { createTransport } from "nodemailer";
import logger from "../logger/logger.js";

class Mail {
  createTransport() {
    return createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      tls: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(email, subject, message) {
    const transporter = this.createTransport();
    transporter
      .sendMail({
        from: "pari@e8i.ir",
        to: email,
        subject: subject,
        text: message,
      })
      .then(() => console.log("Email has been sent."))
      .catch((err) => logger.error(err));
  }
}
export default new Mail();
