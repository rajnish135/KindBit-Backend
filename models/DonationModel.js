import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: String,

  foodDetails: {
    type: String,
    required: true
  },

  quantity: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true
  },

  foodType: {
    type: String,
    required: true
  },

  donorExpiryDuration: { // in milliseconds
    type: Number,
    required: true
  },

  expiryAt: {
    type: Date,
    required: true
  },

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
    enum: ['available', 'claimed', 'picked', 'deleted'],
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

  availableTime: {
    type: String,
    required: true,
  },

  pickedAt: Date,

  reviewed: {
    type: Boolean,
    default: false,
  }

}, {
  timestamps: true 
});

export const DonationModel = mongoose.model('Donation', donationSchema);
