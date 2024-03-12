import Feedback from "../model/feedback.model.js";
import errorHandler from "../utils/error.js";
import AppError from "../utils/appError.js";
import FeedbackRepository from "../repositories/feedback.repo.js";

//* feedback routes
export const getAllFeedback = async (req, res, next) => {
  const feedbackRepo = new FeedbackRepository();
  try {
    const allFeedback = await feedbackRepo.getAllFeedback();
    res.status(200).json(allFeedback);
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req, res, next) => {
  const feedbackRepo = new FeedbackRepository();
  try {
    //* MongoDB
    const feedback = await feedbackRepo.getFeedbackById(req.params.id);

    //! handle the wrong id in a another way
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
  const feedbackRepo = new FeedbackRepository();
  try {
    //! handle input
    const newFeedback = await feedbackRepo.createFeedback(req.body);
    res.status(201).json(newFeedback);
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  const feedbackRepo = new FeedbackRepository();
  try {
    const updatedFeedback = await feedbackRepo.updateFeedback(
      req.params.id,
      req.body,
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
  const feedbackRepo = new FeedbackRepository();

  try {
    const deletedFeedback = await feedbackRepo.deleteFeedback(req.params.id);
    if (!deletedFeedback) {
      return next(errorHandler(404, "No feedback found with this ID"));
    }
    res.status(200).json("Feedback has been deleted!");
  } catch (error) {
    next(error);
  }
};
