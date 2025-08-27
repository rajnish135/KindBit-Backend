import { DonationModel } from "../models/DonationModel.js";

export async function allDonations(req,res){

  try {

    let donations;
    const role = req.user.role;
    const userId = req.user.userId;

    let query = {};

     if (role === "receiver") {
      query = {
        $or: [
          {
            status: { $in: ["available", "claimed"] },
            expiryAt: { $gte: new Date() }   //  exclude stale
          },
          { status: "picked", receiver: userId },
        ],
      };
    }


    donations = await DonationModel.find(query)
    .populate("receiver", "_id") // Only get _id for comparison
    .sort({ createdAt: -1 });


    console.log("Donations",donations);

    return res.json({donations});
  } 
  catch (err) 
  {
    return res.status(500).json({ message: 'Failed to fetch donations' });
  }
    
}