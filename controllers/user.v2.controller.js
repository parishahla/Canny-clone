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

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const payload = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      photo: req.file ? req.file.filename : "default.jpg",
    };

    if (await UserRepository.getUserByEmail(payload.email)) {
      return next(new AppError("This email has been taken", 404));
    }

    if (await UserRepository.getUserByUsername(payload.username)) {
      return next(new AppError("This username has been taken", 404));
    }

    const newUser = {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      photo: payload.photo,
    };

    const result = await UserRepository.createUser(newUser);

    res.status(201).json(result);
  } catch (error) {
    logger.error(error);
    next(new AppError("An error occurred, could not create the user", 500));
  }
};

//! payload validation for update, isrequired is not included
export const updateUser = async (req, res, next) => {
  try {
    const payload = {
      userId: req.user._id,
      parameterId: req.params.id,
    };

    const updatePayload = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      photo: req.file ? req.file.filename : "default.jpg",
    };

    if (payload.userId.toString() !== payload.parameterId.toString())
      throw new AppError("You can only update your own account");

    if (
      updatePayload.email &&
      (await UserRepository.getUserByEmail(updatePayload.email))
    ) {
      return next(new AppError("This email has been taken", 404));
    }

    if (
      updatePayload.username &&
      (await UserRepository.getUserByUsername(updatePayload.username))
    ) {
      return next(new AppError("This username has been taken", 404));
    }

    const updatedUser = await UserRepository.updateUser(
      payload.parameterId,
      updatePayload,
    );

    const { password, ...rest } = updatedUser._doc;
    //! Should change password route be on its own?
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//!payload - refactor authorize user
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
