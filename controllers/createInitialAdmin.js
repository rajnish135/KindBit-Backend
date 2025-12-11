import bcrypt from 'bcrypt';
import { UserModel } from '../models/UserModel.js'; 
import { connectDB } from '../config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config(); 

async function createInitialAdmin() {
  try {
    await connectDB(); 

    const existingAdmin = await UserModel.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Admin already exists. Aborting.');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

    await UserModel.create({
      username: 'Rajnish',
      password: hashedPassword,
      email: process.env.ADMIN_EMAIL,
      role: 'admin',
      isVerified: true,  
    });

    console.log('Initial admin created successfully!');
  } 
  catch (err) {
    console.error('Error creating admin:', err);
  }
}

createInitialAdmin();
