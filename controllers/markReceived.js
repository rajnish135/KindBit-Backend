// import { DonationModel } from "../models/DonationModel.js";

// export async function markRecieved(req, res){
//   const donationId = req.params.receiverId;
//   const userId = req.user.userId;

//    console.log("userId",userId);
 

//   const donation = await DonationModel.findById(donationId);

//   if (!donation) 
//   return res.status(404).json({ message: "Donation not found" });

//   if (donation.receiver.toString() !== userId)
//   return res.status(403).json({ message: "Unauthorized to mark this donation" });

//   donation.status = 'picked';
//   donation.pickedAt = new Date();

//   await donation.save();

//   res.json({ message: "Donation marked as received", donation });
// }


import { DonationModel } from "../models/DonationModel.js";

export async function markRecieved(req, res) {
  try {
    const donationId = req.params.receiverId;
    const userId = req.user.userId;

    console.log("userId", userId);

    const donation = await DonationModel.findById(donationId);

    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    if (donation.receiver.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized to mark this donation" });

    donation.status = 'picked';
    donation.pickedAt = new Date();

    await donation.save();

    // ✅ Emit socket event after updating status
    const io = req.app.get('io');
    io.emit('donationUpdated', donation); // broadcast updated donation

    res.json({ message: "Donation marked as received", donation });
  } catch (error) {
    console.error("Mark Received Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
}
