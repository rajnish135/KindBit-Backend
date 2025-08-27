import { DonationModel } from "../models/DonationModel.js";

export async function donations(req, res) {
  try {

  //You’re getting only this donor’s donations, 
  // and replacing both donor and receiver IDs with their username.

    const donations = await DonationModel.find({ donor: req.user.userId })
      .populate('receiver', 'username')
      .populate('donor', 'username');

    res.json({ success: true, data: donations });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}
