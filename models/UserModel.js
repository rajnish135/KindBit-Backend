import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  
  username: String,

  password: String,

   role: {
    type: String,
    enum: ['donor', 'receiver','admin'],
    default: 'donor'
  },

  email: {
  type: String,
  required: true,
  unique: true
  },

  isVerified: { 
    type: Boolean, 
    default: false },

verificationToken: { 
  type: String }


});

export const UserModel = mongoose.model('User', UserSchema);
