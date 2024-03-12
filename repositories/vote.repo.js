import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";
import Vote from "../model/vote.model.js";

class VoteRepository {
  // findOne({
  //     $and: [
  //       { feedbackId: new ObjectId(req.params.id) },
  //       { upvotedBy: new ObjectId(decoded._id) },
  //     ],
  //   })
  async findVote(feedbackId, userId) {
    const result = Vote.findOne({
      $and: [{ feedbackId: feedbackId }, { upvotedBy: userId }],
    });
    return result;
  }

  async upvote(feedbackId, userId) {
    try {
      await Vote.insertOne({
        feedbackId: feedbackId,
        upvotedBy: userId,
      });
    } catch (error) {
      logger.error(error);
      return new AppError("Could't upvote", 404);
    }
  }

  async downvote(userId) {
    try {
      return await Vote.findByIdAndDelete(userId);
    } catch (error) {
      logger.error(error);
      return new AppError("Could not delete the user", 404);
    }
  }
}

export default VoteRepository;
