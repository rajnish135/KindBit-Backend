import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,          // 465 for SSL, 587 for TLS
  secure: true,       // true for 465, false for 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Gmail App Password
  },
  connectionTimeout: 240000, // 4 minutes in milliseconds
  greetingTimeout: 240000,   // 4 minutes
  socketTimeout: 240000,     // 4 minutes
});
