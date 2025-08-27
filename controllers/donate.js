import { DonationModel } from "../models/DonationModel.js";
import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import { NotificationModel } from "../models/NotificationModel.js";
import { UserModel } from "../models/UserModel.js";

// Default expiry durations per food type (ms)
const foodTypeExpiryMap = {
  "Cooked Meal": 12 * 60 * 60 * 1000, // 12 hours
  "Fruits": 2 * 24 * 60 * 60 * 1000,  // 2 days
  "Vegetables": 3 * 24 * 60 * 60 * 1000,
  "Dairy Products": 24 * 60 * 60 * 1000,
  "Packaged Snacks": 7 * 24 * 60 * 60 * 1000,
};

function calculateExpiry(foodType, donorDurationMs) {
  const defaultExpiry = foodTypeExpiryMap[foodType] || 24 * 60 * 60 * 1000;
  return new Date(Date.now() + (donorDurationMs < defaultExpiry ? donorDurationMs : defaultExpiry));
}

export async function donate(req, res) {
  const {
    foodDetails,
    quantity,
    name,
    latitude,
    longitude,
    availableTime,
    foodType,
    donorExpiryValue, // numeric value
    donorExpiryUnit,  // 'hours' or 'days'
  } = req.body;

  const donorId = req.user.userId;
  let ImageUrl = "";

  // Validate required fields
  if (!foodDetails || !quantity || !foodType || !donorExpiryValue || !donorExpiryUnit || !availableTime) {
    return res.status(400).json({
      message: "Food details, quantity, food type, expiry duration, and pickup time are required",
    });
  }

  // Convert donor expiry to milliseconds
  let donorExpiryMs = Number(donorExpiryValue);
  if (donorExpiryUnit === "days") {
    donorExpiryMs *= 24 * 60 * 60 * 1000;
  } else {
    donorExpiryMs *= 60 * 60 * 1000; // default: hours
  }

  // Upload image if provided
  if (req.file && req.file.path) {
    try {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (uploadedImage?.secure_url) ImageUrl = uploadedImage.secure_url;
    } 
    catch (err) {
      console.error("Image upload error:", err);
    }
  }

  try {
    // Calculate final expiry
    const expiryAt = calculateExpiry(foodType, donorExpiryMs);

    // Create donation
    const newDonation = await DonationModel.create({
      name,
      donor: donorId,
      foodDetails,
      quantity,
      foodType,
      donorExpiryDuration: donorExpiryMs,
      expiryAt,          //A Date object representing the exact expiry date/time.
                         //Example: Mon Aug 27 2025 18:30:00 GMT+0530 (India Standard Time)
      image: ImageUrl,
      location: { type: "Point", coordinates: [longitude, latitude] },
      availableTime,
    });

    // Notify receivers and admins
    const io = req.app.get("io");
    const usersToNotify = await UserModel.find({ role: { $in: ["receiver", "admin"] } });

    for (const user of usersToNotify) {
      const notification = await NotificationModel.create({
        userId: user._id,
        message: `🍱 New food donated: ${newDonation.name}`,
        isRead: false,
        createdAt: new Date(),
      });
      
      io.to(user._id.toString()).emit("new_notification", notification);
      io.to(user._id.toString()).emit("donationAdded", newDonation);
      
    }

    res.status(200).json({ message: "Donation recorded successfully", donation: newDonation });
  } 
  catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ message: "Failed to record donation" });
  }
}


