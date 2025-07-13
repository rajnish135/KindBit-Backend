import crypto from 'crypto';
import {UserModel} from '../models/UserModel.js';
import { transporter } from './utils/emailTransporter.js'; 

export const forgotPassword = async (req, res) => {

  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Store token and expiry
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // Construct reset link
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Send email
    await transporter.sendMail({
      to: email,
      subject: 'KindBite - Password Reset',
      html: `
        <p>Hello ${user.name || ''},</p>
        <p>You requested a password reset for your KindBite account.</p>
        <p><a href="${resetLink}">Click here to reset your password</a>. This link will expire in 10 minutes.</p>
      `,
    });

    res.json({ message: 'Password reset link sent to your email' });

  } 
  catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
