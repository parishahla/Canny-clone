import express from "express";
import {
  getAllFeedback,
  sendFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  sendUpvote,
  sendDownvote,
} from "../versions/feedback.v1.controller.js";

const router = express.Router();

router.route("/").get(getAllFeedback).post(sendFeedback);
router
  .route("/:id")
  .get(getFeedback)
  .patch(updateFeedback)
  .delete(deleteFeedback);
router.route("/:id/upvote").patch(sendUpvote);
router.route("/:id/downvote").patch(sendDownvote);

export default router;
