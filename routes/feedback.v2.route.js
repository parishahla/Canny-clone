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
import ValidationMiddleware from "../controllers/validation.js";
const router = express.Router();

router.route("/").get(getAllFeedback).post(protect, sendFeedback);
router
  .route("/:id")
  .get(getFeedback)
  .patch(protect, ValidationMiddleware.validateUserInput, updateFeedback)
  .delete(protect, deleteFeedback);

router.route("/:id/upvote").patch(protect, sendUpvote);
router.route("/:id/downvote").patch(protect, sendDownvote);

export default router;
