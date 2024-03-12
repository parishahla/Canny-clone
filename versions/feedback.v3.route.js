import express from "express";
import {
  getAllFeedback,
  sendFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  countUpvote,
  uploadFeedbackPhoto,
} from "./feedback.v3.controller.js";
import { protect } from "./auth.v3.controller.js";
import { sendUpvote, sendDownvote } from "../controllers/vote.controller.js";

const router = express.Router();

router
  .route("/")
  .get(getAllFeedback)
  .post(protect, uploadFeedbackPhoto, sendFeedback);
router
  .route("/:id")
  .get(getFeedback)
  .patch(protect, uploadFeedbackPhoto, updateFeedback)
  .delete(protect, deleteFeedback);

router.route("/:id/upvote").patch(protect, sendUpvote);
router.route("/:id/downvote").patch(protect, sendDownvote);

router.route("/:id/upvotesCount").get(protect, countUpvote);

export default router;
