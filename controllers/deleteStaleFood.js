import { DonationModel } from "../models/DonationModel.js";

export async function deleteStaleFood(req, res) {

  const thresholdTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

  try {
    // First, find stale donations
    const staleDonations = await DonationModel.find({
      status: 'available',
      createdAt: { $lt: thresholdTime }
    });

    const staleIds = staleDonations.map(donation => donation._id.toString());
    console.log("Stale Donatoins",staleDonations);

    // Then delete them
    const result = await DonationModel.deleteMany({
      _id: { $in: staleIds }
    });

    // Emit to all clients
    req.app.get('io').emit('donationDeleted', staleIds);

    res.json({ message: `Deleted ${result.deletedCount} stale donations.` });
  } 
  catch (err) {
    res.status(500).json({ message: 'Failed to delete stale donations.' });
  }
  
}
