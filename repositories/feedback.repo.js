import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";
import Feedback from "../model/feedback.model.js";

class FeedbackRepository {
  async createFeedback(feedbackData) {
    try {
      await Feedback.create(feedbackData);
    } catch (error) {
      logger.error(error);
      return new AppError("Could not create the feeedback", 404);
    }
  }

  async getFeedbackById(feedbackId) {
    try {
      return await Feedback.findById(feedbackId);
    } catch (error) {
      logger.error(error);
      throw new AppError("Could not get the feedback", 404);
    }
  }

  async getAllFeedback() {
    try {
      return await Feedback.find({});
    } catch (error) {
      logger.error(error);
      return new AppError("Could not get any posts", 404);
    }
  }

  async updateFeedback(feedbackId, newData) {
    try {
      return await Feedback.findByIdAndUpdate(feedbackId, newData, {
        new: true,
      });
    } catch (error) {
      logger.error(error);
      return new AppError("Could not update the feedback", 404);
    }
  }

  async deleteFeedback(feedbackId) {
    try {
      return await Feedback.findByIdAndDelete(feedbackId);
    } catch (error) {
      logger.error(error);
      return new AppError("Could not delete the feedback", 404);
    }
  }

  async getUserByFeedback(feedbackId) {
    try {
      const feedback = await Feedback.findById(feedbackId).catch((err) => {
        logger.error(err);
        throw new AppError("Could not get the feedback", 404);
      });

      if (!feedback) throw new AppError("Could not get the feedback", 404);

      return feedback.userId;
    } catch (error) {
      logger.error(error);
      return new AppError("Could not get the user", 404);
    }
  }

  async showOneUserFeedback(id) {
    try {
      return await Feedback.find({ userId: id });
    } catch (error) {
      logger.error(error);
      return new AppError("Could not get the user", 404);
    }
  }
}

export default new FeedbackRepository();
