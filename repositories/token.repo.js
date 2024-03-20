import { promisify } from "util";
import jwt from "jsonwebtoken";
import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";
import Token from "../model/token.model.js";

class TokenRepository {
  async findTokenById(id) {
    try {
      return await Token.findOne({ userId: id });
    } catch (err) {
      throw new AppError("Couldn't get the token");
    }
  }

  async deleteExistingToken(id) {
    try {
      return await Token.deleteOne({ userId: id });
    } catch (err) {
      throw new AppError("Couldn't delete the token");
    }
  }

  async createToken(id, hashedToken) {
    return await new Token({
      userId: id,
      token: hashedToken,
      createdAt: Date.now(),
    }).save();
  }

  async getUserForAuth(id) {
    try {
      // return await Token.find({
      //   $and: [{ userId: id }, { expiration: { $gt: new Date(Date.now()) } }],
      // }).catch(() => new AppError("Couldn't get the token", 404));

      return await Token.find({ userId: id }).catch(
        () => new AppError("Couldn't get the token", 404),
      );
    } catch (err) {
      throw new AppError("Token might be expired");
    }
  }

  signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async decodeToken(token) {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return Object.values(decoded)[0];
  }

}

export default new TokenRepository();
