import bcrypt from 'bcrypt';
import { UserModel } from "../models/UserModel.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config(); // ✅Load .env variables
import nodemailer from 'nodemailer';  

export async function registerUser(req,res) {
  
  try{

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const { username, password, role, email} = req.body;
  
  const userExists = await UserModel.findOne({ username });

  if (userExists) 
  return res.status(400).json({ message: 'User already exists' });
  
  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.create({
     username,
     password: hashedPassword,
     role: role || 'donor',
     verificationToken,
     email
    });

  // Send verification email here ✅
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Use Gmail App Password, not your main password
      }
    });

      const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `
        <p>Hello ${username},</p>
        <p>Click below to verify your email:</p>
        <a href="https://kindbit-backend.onrender.com/api/verify-email?token=${verificationToken}">
          Verify Email
        </a>
      `
    };


    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Registration successful! Please check your email to verify your account.' });

  } 
  catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed.' });
  }

};