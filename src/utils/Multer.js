import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!req.user) {
      throw new Error("User not authenticated");
    }
    return {
      folder: "profile_pics",
      format: "png",
      public_id: `${req.user._id}-${Date.now()}`, 
    };
  },
});

export const upload = multer({ storage });
