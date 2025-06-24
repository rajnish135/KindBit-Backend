import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dmcebnkfu",
  api_key: "646975126157492",
  api_secret: "x9KoHQc1W0Y4CxfbW7wL-i13ni0",
});

export const uploadOnCloudinary = async (localFilePath) => {
  
  try{
    
    if (!localFilePath) 
    return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
    });

    console.log("✅ Cloudinary Upload Success:", response.secure_url);

    // Delete the local file after successful upload
    fs.unlink(localFilePath, (err) => {
      if (err) 
      console.log("Failed to delete local file:", err);
    });

    return response;
  }

  catch (error) 
  {
    console.error("Cloudinary Upload Error:", error);

    // Always try to delete file even if upload fails
    fs.unlink(localFilePath, (err) => 
    {
      if(err)
        console.log("Failed to delete local file after upload error:",err);
    });

    return null;
  }
};


