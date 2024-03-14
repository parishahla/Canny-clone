import multer from "multer";
// import userValidation from "./validation.js";
import UserRepository from "../repositories/user.repo.js";
import errorHandler from "../utils/error.js";
import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";

// //* image upload
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    // user-id-timestamp.jpg -> unique name
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-someUserId-${Date.now()}.${ext}`);
  },
});

// // filter out the ones that are not images
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

export const uploadUserPhoto = upload.single("photo");

// async function validateInput(userData) {
//   // Validate user data using Joi schema
//   const { error } = userValidation.validate(userData);
//   if (error) {
//     logger.error(error.details[0].message);
//     return new AppError(error.details[0].message, 401);
//   }
// }

// async function checkUnique(userData) {
//   const userRepo = new UserRepository();

//   // Validate if the username and email are already in use
//   const existingUsername = await userRepo.getUserByUsername(userData.username);
//   if (existingUsername) {
//     return new AppError("Username already in use", 401);
//   }

//   const existingEmail = await userRepo.getUserByEmail(userData.email);
//   if (existingEmail) {
//     return new AppError("Email already in use", 401);
//   }

//   return true;
// }

export const getAllUsers = async (req, res, next) => {
  try {
    // user object - destructure if needed
    const users = await UserRepository.getAllUser();
    res.status(200).json(users);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserById(req.params.id);

    //! handle the wrong id in a another way
    if (!user) return next(errorHandler(404, "User not found!"));

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      // photo: req.file.filename,
    };
    console.log(newUser);
    // const r1 = await validateInput(newUser);
    // console.log(r1);
    // const  error = await checkUnique(newUser);
    // if (error) return console.log(error);

    const result = await UserRepository.createUser(newUser);

    res.status(201).json(result);
  } catch (error) {
    logger.error(error);
    next(new AppError("An error occurred,Could not create the user", 500));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await UserRepository.updateUser(
      req.params.id,
      req.body,
    );
    // const { password, ...rest } = updatedUser._doc;
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id.toString())
    return next(new AppError("You can only delete your own account"));

    await UserRepository.deleteUser(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};
