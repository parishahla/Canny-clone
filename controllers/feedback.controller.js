import Feedback from "../model/feedback.model.js";
import errorHandler from "../utils/error.js";
import AppError from "../utils/appError.js";

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
