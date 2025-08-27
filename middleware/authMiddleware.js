import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';

export const authMiddleware = async (req, res, next) => {

  try {
    
    // Getting token from Authorization header
    const authHeader = req.headers.authorization;
    
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : "";

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decode.userId).select('-password');

    if (!user) 
    return res.status(401).json({ message: 'Invalid token', logout: true });

    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
    }
    
//Attached full user as an object + decoded userId separately to each request object
    req.user = {
        ...user.toObject(),
        userId: decode.userId
     };

    next();                //proceed to the next middleware or route handler

  } 
  
  catch (err) 
  {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Unauthorized', logout: true });
  }
};
