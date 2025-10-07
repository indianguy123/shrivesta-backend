import multer from "multer";
import path from "path";

//the images comes from client to the api then the image is temporaritly stored in the uploads folder of the server and then the image is saved to cludinary and then a url is returned which would be stored in db.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
