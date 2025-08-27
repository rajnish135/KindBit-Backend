import {DonationModel} from '../models/DonationModel.js';

export const deleteSingleFoodItem = async (req, res) => {

  try {
    const { foodId } = req.params;

    // Find donation by ID
    const donation = await DonationModel.findByIdAndDelete(foodId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
         
    req.app.get('io').emit('donationDeleted', foodId);

    res.status(200).json({ message: 'Donation deleted successfully' });
  } 

  catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ message: 'Server error while deleting donation' });
  }

};
