import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


export default sendEmail;
