import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "../utils/error.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feedback = () =>
  JSON.parse(fs.readFileSync(`${__dirname}/../data/feedback.json`));

// fs write promise
function writeFilePromise(filePath, data, res, status) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.status(status).json(data));
      }
    });
  });
}

//* feedback routes
export const getAllFeedback = (req, res, next) => {
  try {
    //* JSON - no async await
    return res.status(200).json(feedback());
  } catch (error) {
    next(error);
  }
};

export const getFeedback = (req, res, next) => {
  try {
    // * JSON - not asynchronous
    const feedbackData = feedback();
    const id = +req.params.id;
    const currentFeedback = feedbackData?.find((el) => el.id === id);
    if (!currentFeedback) return next(errorHandler(404, "Feedback not found!"));

    return res.status(200).json(currentFeedback);
  } catch (error) {
    next(error);
  }
};

export const sendFeedback = async (req, res, next) => {
  try {
    //* JSON
    const feedbackData = feedback();

    // //* create a new id for the new record
    const newId = feedbackData[feedbackData.length - 1].id + 1;
    console.log(newId);
    // //* assign the new id to the req
    const newFeedback = Object.assign({ id: newId }, req.body);
    // //* push to the feedback array
    feedbackData.push(newFeedback);

    await writeFilePromise(
      `${__dirname}/../data/feedback.json`,
      JSON.stringify(feedbackData),
      res,
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = (req, res, next) => {
  return res.status(200).json(feedback());
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const feedbackData = feedback();
    const id = +req.params.id;
    const currentFeedback = feedbackData?.find((el) => el.id === id);
    if (!currentFeedback) return next(errorHandler(404, "Feedback not found!"));

    const newFeedbackArray = feedbackData.filter(
      (f) => f.id !== currentFeedback.id,
    );

    await writeFilePromise(
      `${__dirname}/../data/feedback.json`,
      JSON.stringify(newFeedbackArray),
      res,
      202,
    );
  } catch (error) {
    next(error);
  }
};

export const sendUpvote = async (req, res, next) => {
  try {
    //* JSON - async
    const feedbackData = feedback();
    const reqId = +req.params.id;
    let feedbackObj = feedbackData.find((el) => el.id === reqId);

    if (!feedbackObj.upvote) {
      feedbackObj.upvote = 0;
      feedbackObj.upvote++;
    } else {
      feedbackObj.upvote++;
    }

    await writeFilePromise(
      `${__dirname}/../data/feedback.json`,
      JSON.stringify(feedbackData),
      res,
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const sendDownvote = async (req, res, next) => {
  try {
    const feedbackData = feedback();
    console.log(feedbackData);
    const reqId = +req.params.id;
    let feedbackObj = feedbackData.find((el) => el.id === reqId);
    feedbackObj.upvote--;
    console.log(feedbackObj);
    console.log(feedbackData);
    await writeFilePromise(
      `${__dirname}/../data/feedback.json`,
      JSON.stringify(feedbackData),
      res,
      201,
    );
  } catch (error) {
    next(error);
  }
};

//! invalid id, update
