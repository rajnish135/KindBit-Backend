import {DonationModel} from '../models/DonationModel.js';

export const getAllDonationsForAdmin = async (req,res) => {

  try {
    const donations = await DonationModel.find()
      .populate('donor', 'username email isSuspended')
      .populate('receiver', 'username email isSuspended')
      .sort({ createdAt: -1 });

    res.json({donations});  
  } 
  catch (err) {
    console.error('Admin fetch donations error:', err);
    res.status(500).json({ message: 'Failed to fetch donations' });
  }

};
