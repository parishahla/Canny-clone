import bcrypt from "bcrypt";
import crypto from "crypto";
import TokenRepository from "../repositories/token.repo.js";
import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";

export const generateToken = async (id) => {
  const token = await TokenRepository.findTokenById(id);

  if (token) {
    await TokenRepository.deleteExistingToken(id);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = await bcrypt.hash(resetToken, 10);

  TokenRepository.createToken(id, hashedToken);

  return resetToken;
};
export const isValidToken = async (plainToken, id) => {
  try {
    const user = await TokenRepository.getUserForAuth(id);
    if (user.length === 0) throw new AppError("Token not found");

    const { token } = user[0];

    if (token) {
      const isValid = bcrypt.compare(plainToken, token);
      return isValid;
    }
    //!tenary for returning true or false - bcrypt compare is repeated
    return false;
  } catch (err) {
    logger.error(err);
    logger.info("something went wrong...");
    throw new AppError("something went wrong...", 404);
  }
};
