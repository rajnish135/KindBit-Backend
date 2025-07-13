import { UserModel } from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

    // Check if user is suspended
    if (user.isSuspended) {
        return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }
    
    // Block login if email is not verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

    // Include role in JWT payload
    const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET
    );

    const cookieOptions = {
        httpOnly: true,
    };

    res.cookie('token', token, cookieOptions);

   
  res.json({
  message: 'Login successful',
  token,
  role: user.role,
  userId: user._id, 
  });

}
