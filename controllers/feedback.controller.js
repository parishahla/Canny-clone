import Feedback from "../model/feedback.model.js";
import errorHandler from "../utils/error.js";
import AppError from "../utils/appError.js";
import User from "../model/user.model.js";
import Vote from "../model/vote.model";
import { Jwt } from "jsonwebtoken";
import { promisify } from "util";

//* feedback routes
export const getAllFeedback = async (req, res, next) => {
  try {
    const allFeedback = await Feedback.find();
    res.status(200).json(allFeedback);
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    //* MongoDB
    const feedback = await Feedback.findById(req.params.id);
    // same as => findOne({ _id: req.params.id})

    // if (!feedback) {
    // return next(errorHandler(404, "No feedback with this ID"));
    //   return next(new AppError("No feedback with this ID", 404));
    // }

    res.status(200).json(feedback);
  } catch (error) {
    next(new AppError("No feedback with this ID", 404));
  }
};

export const sendFeedback = async (req, res, next) => {
  try {
    //* Mongo DB
    const newFeedback = await Feedback.create(req.body);
    res.status(201).json(newFeedback);
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedFeedback) {
      return next(errorHandler(404, "No feedback with this ID"));
    }
    res.status(201).json(updatedFeedback);
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    //* Mongo DB
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!deletedFeedback) {
      return next(errorHandler(404, "No feedback found with this ID"));
    }
    res.status(200).json("Feedback has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const sendUpvote = async (req, res, next) => {
  try {
    // const upvotedFeedback = await Feedback.findByIdAndUpdate(
    //   req.params.id,
    //   { $inc: { vote: 1 } },
    //   {
    //     new: true,
    //     runValidators: true,
    //   },
    // );
    // // { $set: { upvoters: (req.user._id), { $inc: { vote: 1 } }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);


    res.status(201).json(upvotedFeedback);
  } catch (error) {
    next(error);
  }
};

//! How to sppress downvote, when less than 0
export const sendDownvote = async (req, res, next) => {
  try {
    // const downvotedFeedback = await Feedback.findByIdAndUpdate(
    //   req.params.id,
    //   { $inc: { vote: -1 } },
    //   {
    //     new: true,
    //   },
    // );
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // res.status(201).json(downvotedFeedback);
  } catch (error) {
    next(error);
  }
};
