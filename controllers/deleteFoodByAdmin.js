import { DonationModel } from '../models/DonationModel.js';

export const deleteDonationByAdmin = async (req, res) => {
    
  try {
    const { donationId } = req.params;

    const donation = await DonationModel.findByIdAndDelete(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({ message: 'Donation deleted successfully by admin' });
  } 

  catch (err) {
    console.error('Admin delete donation error:', err);
    res.status(500).json({ message: 'Failed to delete donation' });
  }
};
