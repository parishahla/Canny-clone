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
    try {
      //! check if the feedback exists
      const result = Vote.findOne({
        $and: [{ feedbackId: feedbackId }, { upvotedBy: userId }],
      });
      return result;
    } catch (error) {
      logger.error(error);
      return new AppError("Could not get the user");
    }
  }

  async upvote(feedbackId, userId) {
    try {
      //! check if fb exists!
      Vote.create({
        feedbackId: feedbackId,
        upvotedBy: userId,
      });
    } catch (error) {
      logger.error(error);
      return new AppError("Could't upvote", 404);
    }
  }

  async downvote(feedbackId, userId) {
    try {
      return await Vote.deleteOne({
        $and: [{ feedbackId: feedbackId }, { upvotedBy: userId }],
      });
    } catch (error) {
      logger.error(error);
      return new AppError("Could not delete the user", 404);
    }
  }
}

export default new VoteRepository();
