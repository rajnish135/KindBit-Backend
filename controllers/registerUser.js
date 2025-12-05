import bcrypt from 'bcrypt';
import { UserModel } from "../models/UserModel.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config(); 
import {transporter} from './utils/emailTransporter.js'


export async function registerUser(req,res) {
  
  try{

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = Date.now() + 10 * 60 * 1000;

  const { username, password, role, email} = req.body;
  
  const userExists = await UserModel.findOne({ username });
  const emailExists = await UserModel.findOne({ email });

  if (userExists || emailExists) 
  return res.status(400).json({ message: 'User already exists' });
  
  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.create({
     username,
     password: hashedPassword,
     role: role || 'donor',
     verificationToken,
    verificationTokenExpires,
     email,
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