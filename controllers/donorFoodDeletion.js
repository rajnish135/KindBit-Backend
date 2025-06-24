import { DonationModel } from "../models/DonationModel.js";

export async function donorFoodDeleting(req,res){
  try {
    const donationId = req.params.id;
    const userId = req.user.userId;

    const donation = await DonationModel.findOneAndUpdate(
      { _id: donationId, donor: userId },
      { status: 'deleted' },
      { new: true } // ✅ important
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found or unauthorized' });
    }

  const populatedDonation = await DonationModel.findById(donation._id)
    .populate('receiver', 'username')
    .populate('donor', 'username');

    // Emit to all clients 
    req.app.get('io').emit('donationUpdated', populatedDonation);

    res.status(200).json({ message: 'Donation marked as deleted', data: donation });
  } 
  catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};