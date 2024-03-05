import { ObjectId } from "mongodb";
import multer from "multer";
import { getDb } from "../db.js";
import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";

//* image upload
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    // user-id-timestamp.jpg -> unique name
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
});

// filter out the ones that are not images
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

//* user handlers
export const getAllUsers = async (req, res, next) => {
  try {
    const users = [];
    getDb()
      .db()
      .collection("users")
      .find()
      .forEach((user) => {
        users.push(user);
      })
      .then((result) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        logger.error(err);
        next(new AppError("An error occurred", 500));
      });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    getDb()
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        if (!result) return next(new AppError("User not found!", 404));
        const { password, ...rest } = result;

        res.status(200).json(rest);
      })
      .catch((err) => {
        logger.error(err);
        next(new AppError("User not found", 500));
      });
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
      photo: req.body.photo,
    };
    getDb()
      .db()
      .collection("users")
      .insertOne(newUser)
      .then((result) => {
        res.status(201).json({ message: "User added" });
      })
      .catch((err) => {
        logger.error(err);
        next(new AppError("An error occurred", 500));
      });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      photo: req.file.filename,
    };
    getDb()
      .db()
      .collection("users")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: updatedUser,
        },
      )
      .then((result) => {
        res.status(200).json({ message: "User updated" });
      })
      .catch((err) => {
        logger.error(err);
        next(new AppError("An error occurred", 500));
      });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    getDb()
      .db()
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json({ message: "User deleted" });
      })
      .catch((err) => {
        logger.error(err);
        next(new AppError("An error occurred", 500));
      });
  } catch (error) {
    next(error);
  }
};
