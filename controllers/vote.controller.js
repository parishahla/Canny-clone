import jwt from "jsonwebtoken";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import { getDb } from "../db.js";
import { ObjectId } from "mongodb";

export const sendUpvote = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const db = getDb().db();
    const voted = await db.collection("votes").findOne({
      feedbackId: new ObjectId(req.params.id),
      upvotedBy: new ObjectId(decoded.id),
    });

    if (voted) {
      return next(new AppError("You've already voted before.", 400));
    }

    const newVote = await db.collection("votes").insertOne({
      feedbackId: new ObjectId(req.params.id),
      upvotedBy: new ObjectId(decoded.id),
    });

    res.status(201).json(newVote);
  } catch (error) {
    next(error);
  }
};

export const sendDownvote = async (req, res, next) => {
  try {
    let downvote;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const db = getDb().db();

    const voted = await db.collection("votes").findOne({
      feedbackId: new ObjectId(req.params.id),
      upvotedBy: new ObjectId(decoded.id),
    });
    console.log(voted);
    if (voted) {
      downvote = await db.collection("votes").deleteOne({
        feedbackId: new ObjectId(req.params.id),
        upvotedBy: new ObjectId(decoded.id),
      });
    } else {
      return next(new AppError("Can't take your vote twice!", 400));
    }

    res.status(201).json(downvote);
  } catch (error) {
    next(error);
  }
};
