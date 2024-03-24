import express from "express";
import {
  getAllFeedback,
  sendFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  getUserFeedback,
} from "../controllers/feedback.v2.controller.js";
import { protect } from "../controllers/auth.v2.controller.js";
import { sendUpvote, sendDownvote } from "../controllers/vote.controller.js";
import uploadPhoto from "../middlewares/imageUpload.js";
import feedbackSchema from "../middlewares/fb.joi.schema.js";
import validateFeedback from "../middlewares/fb.joi.validation.js";

class Router {
  constructor() {
    this.router = express.Router();
    this.schema = feedbackSchema;
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.get("/", getAllFeedback);
    this.post(
      "/",
      protect,
      uploadPhoto,
      validateFeedback(this.schema),
      sendFeedback,
    );
    this.get("/:id", getFeedback);
    this.patch(
      "/:id",
      protect,
      uploadPhoto,
      validateFeedback(this.schema),
      updateFeedback,
    );
    this.delete("/:id", protect, deleteFeedback);
    this.patch("/:id/upvote", protect, sendUpvote);
    this.patch("/:id/downvote", protect, sendDownvote);
    this.get("/:id/allfeedback", protect, getUserFeedback);
    this.get("/:id/myfeedback", protect, getUserFeedback);
  }
  //! other middlewares: schema validation, upload img

  get(path, ...handler) {
    this.router.get(path, ...handler);
  }

  post(path, ...handlers) {
    this.router.post(path, ...handlers);
  }

  put(path, ...handler) {
    this.router.put(path, ...handler);
  }

  delete(path, ...handler) {
    this.router.delete(path, ...handler);
  }

  patch(path, ...handler) {
    this.router.patch(path, ...handler);
  }

  getRouter() {
    return this.router;
  }
}

export default new Router();

// const router = express.Router();

// router.route("/").get(getAllFeedback).post(protect, sendFeedback);
// router
//   .route("/:id")
//   .get(getFeedback)
//   .patch(protect, updateFeedback)
//   .delete(protect, deleteFeedback);

// router.route("/:id/upvote").patch(protect, sendUpvote);
// router.route("/:id/downvote").patch(protect, sendDownvote);

// router.route("/:id/allfeedback").get(protect, getUserFeedback);
// router.route("/:id/myfeedback").get(protect);
