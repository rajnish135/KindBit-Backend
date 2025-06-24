// import { DonationModel } from "../models/DonationModel.js";
// import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";

// export async function donate(req,res){

//       const { foodDetails, quantity, name, latitude, longitude } = req.body;

//       const donorId = req.user.userId;
      
//        let ImageUrl = "";

//      if (req.file && req.file.path) {
       
//       console.log("Image path",req.file);
      
//       const uploadedImage = await uploadOnCloudinary(req.file.path);

//       if (uploadedImage && uploadedImage.secure_url) {
//            ImageUrl = uploadedImage.secure_url;
//            console.log("Uploaded Image:",ImageUrl);
//       }

//     }
    
//       if (!foodDetails || !quantity) {
//         return res.status(400).json({ message: 'Food details and quantity are required' });
//       }
//       if (isNaN(quantity) || quantity <= 0) {
//         return res.status(400).json({ message: 'Quantity must be a positive number' });
//       }
    
//       try {
        
//       const newDonation =  await DonationModel.create({
//           name,
//           donor: donorId,
//           foodDetails,
//           quantity: Number(quantity),
//           image: ImageUrl,

//           location: {
//             type: 'Point',
//             coordinates: [longitude, latitude] // GeoJSON format
//           },
            
//           donatedAt: new Date(),
//         });
        
//         // ✅ Emit the event using socket.io
//         const io = req.app.get('io');
//         io.emit('donationAdded', newDonation); // Broadcast to all clients

//         res.status(200).json({ message: 'Donation recorded successfully' });
//       } 
//       catch (err) {
//         console.error('Donation error:', err);
//         res.status(500).json({ message: 'Failed to record donation' });
//       }
// };




// BACKEND: donate controller (Node.js)

import { DonationModel } from "../models/DonationModel.js";
import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";

export async function donate(req, res) {
  const { foodDetails, quantity, name, latitude, longitude } = req.body;
  const donorId = req.user.userId;
  let ImageUrl = "";

  // console.log("Name",name);

  if (req.file && req.file.path) {

    try {
      
      const uploadedImage = await uploadOnCloudinary(req.file.path);

      if (uploadedImage && uploadedImage.secure_url){
        ImageUrl = uploadedImage.secure_url;
        console.log("Uploaded Image:", ImageUrl);
      }
    } 
    catch (err) {
      console.error('Image upload error:', err);
    }

  }

  if (!foodDetails || !quantity) 
  return res.status(400).json({ message: 'Food details and quantity are required' });
  

  try {
    const newDonation = await DonationModel.create({
      name:name,
      donor: donorId,
      foodDetails,
      quantity, 
      image: ImageUrl,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      createdAt: new Date(),
    });

    const io = req.app.get('io');
    io.emit('donationAdded', newDonation);

    res.status(200).json({ message: 'Donation recorded successfully' });
  } 

  catch (err) 
  {
    console.error('Donation error:', err);
    res.status(500).json({ message: 'Failed to record donation' });
  }
}
