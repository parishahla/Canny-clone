import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import logger from "../logger/logger.js";
import AppError from "../utils/appError.js";

//* feedback routes
export const getAllFeedback = async (req, res, next) => {
  try {
    await getDb()
      .db()
      .collection("feedbacks")
      .find()
      .toArray((err, result) => {
        if (err) {
          logger.error(err);
          return res.status(500).send("Error fetching documents");
        }
      })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        logger.error(err);
        next(new AppError("An error occurred", 500));
      });
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    const db = await getDb().db();
    const feedback = await db
      .collection("feedbacks")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!feedback) {
      return next(new AppError("Feedback not found", 404));
    }

    res.status(200).json(feedback);
  } catch (error) {
    next(new AppError("No feedback with this ID", 404));
  }
};

export const sendFeedback = async (req, res, next) => {
  try {
    const newFeedback = {
      title: req.body.title,
      desc: req.body.desc,
    };
    const db = await getDb().db();
    const result = await db.collection("feedbacks").insertOne(newFeedback);

    if (!result) {
      return next(new AppError("Couldn't send the feedback", 404));
    }
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const updatedFeedback = {
      title: req.body.title,
      desc: req.body.desc,
    };
    const db = await getDb().db();
    const result = await db.collection("feedbacks").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: updatedFeedback,
      },
    );

    if (!result) {
      return next(new AppError("Couldn't update the feedback", 404));
    }
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const db = await getDb().db();
    const result = await db
      .collection("feedbacks")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res
      .status(200)
      .json({ message: "Feedback has been deleted", data: { result } });
  } catch (error) {
    next(error);
  }
};

export const countUpvote = async (req, res, next) => {
  try {
    const db = await getDb().db();
    const upvotesCount = await db
      .collection("feedbacks")
      .countDocuments({ _id: new ObjectId(req.params.id) });
    console.log(upvotesCount);
    res.status(200).json(upvotesCount);
  } catch (err) {
    next(err);
  }
};
