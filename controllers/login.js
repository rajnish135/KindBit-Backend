import { UserModel } from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

    if (user.isSuspended) {
        return res.status(403).json({ message: 'Your account has been suspended.' });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET
    );
   
  res.json({
  message: 'Login successful',
  token,
  role: user.role,
  userId: user._id, 
  });

}
