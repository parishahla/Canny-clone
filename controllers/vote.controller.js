import jwt from "jsonwebtoken";
import { promisify } from "util";
import { ObjectId } from "mongodb";
import AppError from "../utils/appError.js";
import { getDb } from "../db.js";
import logger from "../logger/logger.js";
import VoteRepository from "../repositories/vote.repo.js";

function getUserId(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return decoded.id;
}

export const sendUpvote = async (req, res, next) => {
  try {
    //? Replace the next two lines with getUserId(req), then capture the decoded.id
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const voted = await VoteRepository.findVote(req.params.id, decoded._id);

    //! must be handled differently
    if (voted) {
      return next(new AppError("You've already voted before.", 400));
    }

    const newVote = await VoteRepository.upvote(req.params.id, decoded._id);

    res.status(201).json(newVote);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const sendDownvote = async (req, res, next) => {
  try {
    let downvote;
    //? Replace the next two lines with getUserId(req), then capture the decoded.id

    const token = req.headers.authorization.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const voted = await VoteRepository.findVote(req.params.id, decoded._id);

    if (voted) {
      downvote = await VoteRepository.downvote(req.params.id, decoded._id);
    } else {
      return next(new AppError("Can't take your vote twice!", 400));
    }

    res.status(201).json(downvote);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
