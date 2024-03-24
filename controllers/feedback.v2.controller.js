import errorHandler from "../utils/error.js";
import AppError from "../utils/appError.js";
import FeedbackRepository from "../repositories/feedback.repo.js";
import { ObjectId } from "mongodb";
import logger from "../logger/logger.js";

const sendResponse = (res, statusCode, json) => {
  res.status(statusCode).json({ data: json });
};

// const authorizeUser = async (userId, feedbackId) => {
//   const userID = await FeedbackRepository.getUserByFeedback(feedbackId).catch(
//     (error) => {
//       logger.error(error);
//       return new AppError("Could not get the user", 404);
//     },
//   );
//   if (userId.toString() !== userID.toString()) {
//     return new AppError("You can only delete/update your own feedback");
//   } else {
//     return true;
//   }
// };

//* feedback routes
export const getAllFeedback = async (req, res, next) => {
  try {
    const allFeedback = await FeedbackRepository.getAllFeedback();
    sendResponse(res, 200, allFeedback);
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    const payload = {
      feedbackId: new ObjectId(req.params.id),
    };
    const feedback = await FeedbackRepository.getFeedbackById(
      payload.feedbackId,
    ).catch((err) => {
      logger.error(err);
      return next(new AppError("Operation failed", 404));
    });

    //! msut be handled differently
    if (!feedback) {
      return next(new AppError("No feedback was found with this ID", 404));
    }

    sendResponse(res, 200, feedback);
  } catch (error) {
    next(new AppError("No feedback with this ID", 404));
  }
};

export const sendFeedback = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      desc: req.body.desc,
      photo: req.file ? req.file.filename : "",
      userId: req.user._id,
    };
    console.log(payload);
    //* payload
    //* decode user id to include in feedback
    //* change feedback model
    //! Joi validation

    await FeedbackRepository.createFeedback(payload);

    return res.status(201).json("Feedback posted!");
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    //! Joi validation middleware
    const feedbackId = req.params.id;
    const payload = {
      title: req.body.title,
      desc: req.body.desc,
      photo: req.file ? req.file.filename : "",
      userId: req.user._id,
    };

    //! authorizeUser(payload.userId, feedbackId);
    const userID = await FeedbackRepository.getUserByFeedback(
      payload.feedbackId,
    ).catch((error) => {
      logger.error(error);
      return new AppError("Could not get the user", 404);
    });

    if (!userID) {
      return next(new AppError("User not found", 404));
    }

    if (payload.userId.toString() !== userID.toString()) {
      return next(new AppError("You can only update your own feedback"));
    }

    const updatedFeedback = await FeedbackRepository.updateFeedback(
      feedbackId,
      payload,
    ).catch((err) => logger.error(err));

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
    const payload = {
      userId: req.user._id,
      feedbackId: req.params.id,
    };

    // authorizeUser(payload.userId, payload.feedbackId);
    const userID = await FeedbackRepository.getUserByFeedback(
      payload.feedbackId,
    ).catch((error) => {
      logger.error(error);
      return new AppError("Could not get the user", 404);
    });

    if (!userID) {
      return next(new AppError("User not found", 404));
    }

    if (payload.userId.toString() !== userID.toString()) {
      return next(new AppError("You can only delete your own feedback"));
    }

    const deletedFeedback = await FeedbackRepository.deleteFeedback(
      payload.feedbackId,
    ).catch((err) => {
      logger.error(err);
      return next(new AppError("Failed to get the post", 404));
    });

    if (!deletedFeedback) {
      return next(new AppError("No feedback was found with this ID", 404));
    }
    res.status(200).json("Feedback has been deleted!");
  } catch (error) {
    next(error);
  }
};

//* Returns all feedback posted by 1 specific user
export const getUserFeedback = async (req, res, next) => {
  try {
    const payload = {
      userId: new ObjectId(req.params.id),
    };
    const userFeedback = await FeedbackRepository.showOneUserFeedback(
      payload.userId,
    );
    if (!userFeedback)
      return next(
        new AppError("Could not find any feedback posted by this user"),
      );
    //!check if they have any feedback at all
    sendResponse(res, 200, userFeedback);
  } catch (err) {
    //!cast to object id must be handled, must say it wasnt found
    next(err);
  }
};
