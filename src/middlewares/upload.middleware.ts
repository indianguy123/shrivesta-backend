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

// File filter to only allow image files
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10mb
    files: 10, // Maximum 10 files
  },
});

// Alternative upload configuration that accepts any field name
export const uploadAny = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10mb
    files: 10, // Maximum 10 files
  },
});
