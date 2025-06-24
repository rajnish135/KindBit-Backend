import { DonationModel } from "../models/DonationModel.js";

export async function claimDonation(req, res) {
  const donationId = req.params.id;
  const userId = req.user.userId;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const claimsToday = await DonationModel.countDocuments({
      receiver: userId,
      claimedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const donation = await DonationModel.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const io = req.app.get('io'); // ✅ Get Socket.IO instance

    // ✅ UNCLAIM if already claimed by same user
    if (donation.status === 'claimed' && donation.receiver?.toString() === userId.toString()) {
      
      donation.status = 'available';
      donation.receiver = null;
      donation.claimedAt = null;
      
      await donation.save();
      
      //FIX
      const updatedDonation = await DonationModel.findById(donation._id)
      .populate('receiver', 'username')
      .populate('donor', 'username');

      io.emit('donationUpdated', updatedDonation);

      return res.json({
        message: 'Donation unclaimed successfully',
        action: 'unclaimed',
        donation : updatedDonation
      });
    }

    // ✅ Limit check
    if (claimsToday >= 3) {
      return res.status(403).json({ message: 'Daily claim limit reached (3/day)' });
    }

    // ✅ Claim if available
    if (donation.status === 'available') {
      donation.status = 'claimed';
      donation.receiver = userId;
      donation.claimedAt = new Date();
      
      await donation.save();

      const updatedDonation = await DonationModel.findById(donation._id)
    .populate('receiver', 'username')
    .populate('donor', 'username');

  io.emit('donationUpdated', updatedDonation);

  return res.json({
    message: 'Donation claimed successfully',
    action: 'claimed',
    donation: updatedDonation // ✅ Also send this back
  });

   
  }

    // ✅ Already claimed by someone else
    return res.status(400).json({
      message: 'This donation is already claimed',
      currentStatus: donation.status
    });

  } catch (err) {
    console.error("Error in toggleClaimDonation:", err);
    return res.status(500).json({
      message: 'Error processing donation claim',
      error: err.message
    });
  }
}
