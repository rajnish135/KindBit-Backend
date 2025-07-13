import bcrypt from 'bcrypt';
import { UserModel } from '../models/UserModel.js';

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // token still valid
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully!' });
  } 
  catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
