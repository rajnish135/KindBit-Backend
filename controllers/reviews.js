import { ReviewModel } from "../models/ReviewModel.js";
import { DonationModel } from "../models/DonationModel.js";

export async function submitReview(req, res) {
  const receiverId = req.user.userId;
  const { donationId, rating, comment } = req.body;

  try {
    const donation = await DonationModel.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const donorId = donation.donor;

    const review = await ReviewModel.create({
      donor: donorId,
      receiver: receiverId,
      rating,
      donation: donationId,
      comment,
    });

    //Mark the donation as reviewed
    donation.reviewed = true;
    await donation.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review
    });

  } 

  catch(error){
    console.error("Review submission error:", error);
    res.status(500).json({ message: "Error submitting review", error });
  }
}


export async function getRecieverReviews(req, res) {
  
  const { donorId } = req.params;

  try {
    const reviews = await ReviewModel.find(
      { donor: donorId }).populate('receiver', 'username');

    res.json(reviews);
  } 

  catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }

}
