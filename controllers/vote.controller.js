import jwt from "jsonwebtoken";
import { promisify } from "util";
import Vote from "../model/vote.model.js";
import AppError from "../utils/appError.js";

export const sendUpvote = async (req, res, next) => {
  try {
    // get feedback id
    // get user id => in the token
    // check if the user has already voted before
    // add a record to the vote model
    // add vote score query to the Feedback vote property
    let newVote;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await Vote.findOne({
      feedbackId: req.params.id,
      upvotedBy: decoded.id,
    });

    if (user) {
      return next(new AppError("You've already voted before.", 401));
    }
    newVote = await Vote.create({
      feedbackId: req.params.id,
      upvotedBy: decoded.id,
    });

    res.status(201).json(newVote);
  } catch (error) {
    next(error);
  }
};

export const sendDownvote = async (req, res, next) => {
  try {
    let downvote;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await Vote.findOne({
      feedbackId: req.params.id,
      upvotedBy: decoded.id,
    });

    if (user) {
        downvote = await Vote.deleteOne({
        feedbackId: req.params.id,
        upvotedBy: decoded.id,
      });
    } else {
      return next(new AppError("Can\'t take your vote twice!", 401));
    }

    res.status(201).json(downvote);
  } catch (error) {
    next(error);
  }
};
