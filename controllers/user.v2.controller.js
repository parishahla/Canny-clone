import UserRepository from "../repositories/user.repo.js";
import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserRepository.getAllUser();
    res.status(200).json(users);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await UserRepository.getUserById(req.params.id).catch(
      (err) => {
        throw new AppError(err, 404);
      },
    );
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  //* Designed for a future admin user
  try {
    if (await UserRepository.getUserByEmail(req.body.email)) {
      throw new AppError("This email has been taken");
    }

    if (await UserRepository.getUserByUsername(req.body.username)) {
      throw new AppError("This username has been taken");
    }

    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      photo: req.file ? req.file.filename : "default.jpg",
    };

    const result = await UserRepository.createUser(newUser);

    res.status(201).json(result);
  } catch (error) {
    logger.error(error);
    next(new AppError("An error occurred, could not create the user", 500));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id.toString())
      throw new AppError("You can only update your own account");

    if (await UserRepository.getUserByEmail(req.body.email)) {
      throw new AppError("This email has been taken");
    }

    if (await UserRepository.getUserByUsername(req.body.username)) {
      throw new AppError("This username has been taken");
    }

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
