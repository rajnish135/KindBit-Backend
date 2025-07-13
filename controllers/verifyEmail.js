import { UserModel } from '../models/UserModel.js';

export async function verifyEmail(req, res)  {

  const { token } = req.query;

  try {

    if (!token) 
    return res.status(400).send('Missing token');
    
    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) 
    return res.status(400).send('Invalid or expired token');
    
    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined; 
    
    await user.save();

    res.send(`
      <h2>Email Verified</h2>
      <p>Your account has been verified. You can now log in.</p>
    `);

  } 
  catch (err) {
    console.error('Email verification error:', err);
    res.status(500).send('Internal server error');
  }
};


