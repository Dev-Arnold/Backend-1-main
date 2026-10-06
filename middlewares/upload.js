import { config } from "dotenv";
config()
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from "../cloudinaryconfig.js";


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_pictures', 
    allowedFormats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});


const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;