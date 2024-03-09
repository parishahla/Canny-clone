import User from "../model/user.model.js";
import userValidation from "./validation.js";
import UserRepository from "../repositories/user.repo.js";
import errorHandler from "../utils/error.js";
import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";

async function validateInput(userData) {
  // Validate user data using Joi schema
  const { error } = userValidation.validate(userData);
  if (error) {
    logger.error(error.details[0].message);
    return new AppError(error.details[0].message, 401);
  }
}

async function checkUnique(userData) {
  console.log(userData);
  // Validate if the username and email are already in use
  const existingUsername = await getUserByUsername(userData.username);
  console.log(existingUsername);
  if (existingUsername) {
    return new AppError("Username already in use", 401);
  }

  const existingEmail = await getUserByEmail(userData.email);
  console.log(existingEmail);
  if (existingEmail) {
    return new AppError("Email already in use", 401);
  }

  return true;
}

// class UserController {
//   constructor() {
//     this.userRepository = new UserRepository();
//   }

//   async createUser(userData) {
//     await validateInput(userData);
//     await checkUnique(userData);

//     // Create the user
//     return this.userRepository.createUser(userData);
//   }

//   async getUser(userId) {
//     return this.userRepository.getUserById(userId);
//   }

//   async updateUser(userId, userData) {
//     return this.userRepository.updateUser(userId, userData);
//   }

//   async deleteUser(userId) {
//     return this.userRepository.deleteUser(userId);
//   }
// }

// export default UserController;
// * user handlers
export const getAllUsers = async (req, res, next) => {
  try {
    // user object - destructure if needed
    const users = await UserRepository.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    logger.error(error);
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
  const userRepo = new UserRepository();
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      // photo: req.file.filename,
    };
    // const r1 = await validateInput(newUser);
    // console.log(r1);
    // const r2 = await checkUnique(newUser);
    // console.log(r2);

    const result = await userRepo.createUser(newUser);
    console.log(result);
    res.status(201).json(result);
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
