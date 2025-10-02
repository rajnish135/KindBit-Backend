import nodemailer from 'nodemailer';  

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Gmail App Password
  },
  connectionTimeout: 20000,  // wait up to 20 seconds to connect
  greetingTimeout: 20000,    // wait up to 20 seconds for SMTP greeting
  socketTimeout: 20000,      // max time for any socket activity
});
