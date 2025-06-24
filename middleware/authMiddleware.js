import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';

export const authMiddleware = async (req, res, next) => {

  try {
    
    // // Try getting token from Authorization header
    const authHeader = req.headers.authorization;
    
    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : "";

    // // If not found in header, try from cookies
    if (!token && req.cookies?.token) {
        token = req?.cookies?.token;
    }
    
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decode.userId).select('-password');

    if (!user) 
    return res.status(401).json({ message: 'Invalid token', logout: true });
    
//Attach full user + decoded userId separately to each request object
    req.user = {
        ...user.toObject(),
        userId: decode.userId
     };

    next();                // ✅ proceed to the next middleware or route handler

  } 
  
  catch (err) 
  {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Unauthorized', logout: true });
  }
};
