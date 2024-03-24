import VoteRepository from "../repositories/vote.repo.js";
import TokenRepository from "../repositories/token.repo.js";
import AppError from "../utils/appError.js";
import logger from "../logger/logger.js";

export const sendUpvote = async (req, res, next) => {
  try {
    const decodedId = await TokenRepository.decodeSigninToken(
      req.headers.authorization.split(" ")[1],
    );

    const payload = {
      feedbackId: req.params.id,
      userId: decodedId,
    };

    const voted = await VoteRepository.findVote(
      payload.feedbackId,
      payload.userId,
    );

    //! must be handled differently - the catch error of the promise is not included anywhere
    if (voted) {
      return next(new AppError("You have already voted before.", 400));
    }

    VoteRepository.upvote(payload.feedbackId, payload.userId);
    //! new vote catch err in the repo, is nowhere to be reflected in here
    res.status(201).json("Feedback upvoted!");
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const sendDownvote = async (req, res, next) => {
  try {
    const decodedId = await TokenRepository.decodeSigninToken(
      req.headers.authorization.split(" ")[1],
    );

    const payload = {
      feedbackId: req.params.id,
      userId: decodedId,
    };

    const voted = await VoteRepository.findVote(
      payload.feedbackId,
      payload.userId,
    );
    console.log(voted);
    //! it might be the error catched back in the repo !
    if (voted) {
      VoteRepository.downvote(payload.feedbackId, payload.userId);
    } else {
      return next(new AppError("You can not take your vote twice!", 400));
    }

    res.status(201).json("Feedback downvoted!");
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
