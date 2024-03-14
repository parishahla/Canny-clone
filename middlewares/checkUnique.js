import logger from "../logger/logger.js";
import UserRepository from "../repositories/user.repo.js";
import AppError from "../utils/appError.js";

//! not a middleware yet, & msut be available globally
function checkUnique() {
  return async (req, res, next) => {
    if (await UserRepository.getUserByEmail(req.body.email)) {
      logger.info("This email has been taken");
      return new AppError("This email has been taken");
    }
    if (await UserRepository.getUserByUsername(req.body.username)) {
      return new AppError("This username has been taken");
    }
    next();
  };
}
export default checkUnique;
