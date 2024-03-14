import express from "express";
import {
  getAllFeedback,
  sendFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedback.v2.controller.js";
import { protect } from "../controllers/auth.v2.controller.js";
import { sendUpvote, sendDownvote } from "../controllers/vote.controller.js";
// import ValidationMiddleware from "../controllers/validation.js";
const router = express.Router();

router.route("/").get(getAllFeedback).post(sendFeedback);
router
  .route("/:id")
  .get(getFeedback)
  .patch(protect, updateFeedback)
  .delete(protect, deleteFeedback);

router.route("/:id/upvote").patch(protect, sendUpvote);
router.route("/:id/downvote").patch(protect, sendDownvote);

export default router;
