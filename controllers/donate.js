import { DonationModel } from "../models/DonationModel.js";
import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";
import {NotificationModel} from "../models/NotificationModel.js";
import {UserModel} from "../models/UserModel.js";

export async function donate(req, res) {
  const { foodDetails, quantity, name, latitude, longitude, availableTime } = req.body;
  const donorId = req.user.userId;
  let ImageUrl = "";

  if (req.file && req.file.path) {
    try {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (uploadedImage && uploadedImage.secure_url) {
        ImageUrl = uploadedImage.secure_url;
        console.log("Uploaded Image:", ImageUrl);
      }
    } catch (err) {
      console.error('Image upload error:', err);
    }
  }

  if (!foodDetails || !quantity) {
    return res.status(400).json({ message: 'Food details and quantity are required' });
  }

  try {
    const newDonation = await DonationModel.create({
      name: name,
      donor: donorId,
      foodDetails,
      quantity,
      image: ImageUrl,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      donatedAt: new Date(),
      availableTime
    });

    const io = req.app.get('io');

    // Get all users who should be notified: receivers + admins
      const usersToNotify = await UserModel.find({ role: { $in: ["receiver", "admin"] } });

      for (const user of usersToNotify) {

        const notification = await NotificationModel.create({
          userId: user._id,
          message: `🍱 New food donated: ${newDonation.name}`,
          isRead: false,
          createdAt: new Date()
          
        });
      

        // Emit to all recievers and admin
        io.to(user._id.toString()).emit("new_notification",notification);
        
      }

    res.status(200).json({ message: 'Donation recorded successfully' });
  } 
  catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ message: 'Failed to record donation' });
  }
}
