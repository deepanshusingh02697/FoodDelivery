import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath:string):Promise<any> => {
  try {
    if (!filePath) {
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "FoodDelivery",
      resource_type: "auto",
    });
    console.log("Image upload result : ",uploadResult);
    
    console.log(
      `response from upload_Imgae_Result secure_url : ${JSON.stringify(uploadResult.secure_url)}`,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    const { secure_url, public_id } = uploadResult;
    return { secure_url, public_id };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.log("cloudinary error ", error);
    throw error;
  }
};

export { uploadOnCloudinary };