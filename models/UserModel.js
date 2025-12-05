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
    type: String 
  },

  verificationTokenExpires:{ Date},

  isSuspended: {
    type: Boolean,
    default: false
  },

  resetPasswordToken: { type: String 
  },

  resetPasswordExpires: { type: Date 
  },


});

export const UserModel = mongoose.model('User', UserSchema);
