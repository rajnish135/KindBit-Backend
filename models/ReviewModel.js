import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },

  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true },

  donation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donation', 
    required: true },

  rating: { 
    type: Number,
    required: true,
    min: 1, 
    max: 5 },
  
  comment: { 
    type: String },

  createdAt: { 
    type: Date, 
    default: Date.now }

});

export const ReviewModel = mongoose.model('Review', reviewSchema);
