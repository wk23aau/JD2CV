import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

let mailTransporter;

try {
  mailTransporter = nodemailer.createTransport(smtpConfig);
  mailTransporter.verify(function(error, success) {
    if (error) {
      console.error("Nodemailer configuration error:", error);
      mailTransporter = null;
    } else {
      console.log("Nodemailer is configured correctly. Server is ready to take our messages.");
    }
  });
} catch (error) {
    console.error("Failed to create Nodemailer transport:", error);
    mailTransporter = null;
}

export { mailTransporter };
