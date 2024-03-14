import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";
import User from "../model/user.model.js";

//! constructor yes or no

class UserRepository {
  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      logger.error(error);
      return new AppError("Could not create the user", 404);
    }
  }

  async getUserById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      logger.error(error);
      throw new AppError("Could not get the user", 404);
    }
  }

  async getAllUser() {
    try {
      return await User.find({});
    } catch (error) {
      logger.error(error);
      return new AppError("Could not get the users", 404);
    }
  }

  async updateUser(userId, newData) {
    try {
      //! Would these options cause any potential injection risks?
      //! addField()
      return await User.findByIdAndUpdate(userId, newData, {
        new: true,
        multi: true,
        upsert: true,
      });
    } catch (error) {
      logger.error(error);
      return new AppError("Could not update the user", 404);
    }
  }

  async deleteUser(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      logger.error(error);
      return new AppError("Could not delete the user", 404);
    }
  }

  async getUserByUsername(username) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      logger.error(error);
      return new AppError("Could not get the user", 404);
    }
  }

  async getUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      logger.error(error);
      return new AppError("Could not get the user", 404);
    }
  }

  async getUserForAuth(hashedToken) {
    return await User.findOne({
      $and: [
        { passwordResetToken: hashedToken },
        { passwordResetExpires: { $gt: new Date(Date.now()) } },
      ],
    });
  }
}

export default new UserRepository();
