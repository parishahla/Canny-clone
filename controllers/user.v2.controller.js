import User from "../model/user.model.js";
import errorHandler from "../utils/error.js";
import Validate from "./validation.js";

//* user handlers
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const validate = new Validate(User);
    const thereISEmail = await validate.findEmail(req.body.email);
    if (thereISEmail) {
      return res.status(400).json({ error: "Email already exists!" });
    }
    const newUser = await User.create(req.body);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};
