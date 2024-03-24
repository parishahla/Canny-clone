import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/appError.js";

//* image upload
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${uuidv4()}.${ext}`);
  },
});

// // filter out the ones that are not image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadPhoto = upload.single("photo");

export default uploadPhoto;
