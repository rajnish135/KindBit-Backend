import { DonationModel } from "../models/DonationModel.js";

export async function donations(req, res) {
  try {
    const donations = await DonationModel.find({ donor: req.user.userId })
      .populate('receiver', 'username')
      .populate('donor', 'username email');

    res.json({ success: true, data: donations });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}
