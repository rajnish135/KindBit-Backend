import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({

  donor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',                                
  required: true
 },

  name:String ,

  foodDetails: String,
  
  quantity: {
    type: String, 
    required: true,
  },

  createdAt: { type: Date, default: Date.now },

  image: { type: String, default: null },

  location: {

    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    }
    
  },

  status: {
  type: String,
  enum: ['available', 'claimed', 'picked','deleted'],
  default: 'available',
  },

  receiver: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
  },

  claimedAt: {
  type: Date,
  default: null,
  },

  donatedAt: {
  type: Date,
  default: Date.now,
},

pickedAt: Date, 

reviewed: {
  type: Boolean,
  default: false,
}



});

export const DonationModel = mongoose.model('Donation', donationSchema);
