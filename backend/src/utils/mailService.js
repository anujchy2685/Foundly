
import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: `"Foundly" <${process.env.MAIL_FROM}>`,
    to,
    subject,
    text,
  });

  console.log("Email sent:", info.messageId);

  return info;
};

export default sendMail;