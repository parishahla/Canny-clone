// import { MongoClient } from "mongodb";
// import Feedback from "../model/feedback.model.js";
// import errorHandler from "../utils/error.js";
// import AppError from "../utils/appError.js";
// import logger from "../logger/logger.js";

// //* feedback routes
// export const getAllFeedback = async (req, res, next) => {
//   try {
//     MongoClient.connect(process.env.MONGO)
//       .then((client) => {
//         logger.info("Connected to MongoDB");
//         client
//           .db()
//           .collection("feedbacks")
//           .find()
//           .forEach((el) => console.log(el))
//           .then(() => {
//             client.close();
//           });
//       })
//       .catch((err) => logger.error(err));

//     // const allFeedback = await Feedback.find();
//     res.status(200).json({ message: "yeah" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getFeedback = async (req, res, next) => {
//   try {
//     //* MongoDB
//     const feedback = await Feedback.findById(req.params.id);
//     // same as => findOne({ _id: req.params.id})

//     // if (!feedback) {
//     // return next(errorHandler(404, "No feedback with this ID"));
//     //   return next(new AppError("No feedback with this ID", 404));
//     // }

//     res.status(200).json(feedback);
//   } catch (error) {
//     next(new AppError("No feedback with this ID", 404));
//   }
// };

// export const sendFeedback = async (req, res, next) => {
//   try {
//     //* Mongo DB
//     // const newFeedback = await Feedback.create(req.body);
//     MongoClient.connect(process.env.MONGO)
//       .then((client) => {
//         logger.info("Connected to MongoDB");
//         client
//           .db()
//           .collection("feedbacks")
//           .insertOne(req.body)
//           .then((result) => {
//             console.log(result);
//             client.close();
//           });
//       })
//       .catch((err) => logger.error(err));
//     res.status(201).json({ message: ";lmkm" });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateFeedback = async (req, res, next) => {
//   try {
//     const updatedFeedback = await Feedback.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       },
//     );
//     if (!updatedFeedback) {
//       return next(errorHandler(404, "No feedback with this ID"));
//     }
//     res.status(201).json(updatedFeedback);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteFeedback = async (req, res, next) => {
//   try {
//     //* Mongo DB
//     const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
//     if (!deletedFeedback) {
//       return next(errorHandler(404, "No feedback found with this ID"));
//     }
//     res.status(200).json("Feedback has been deleted!");
//   } catch (error) {
//     next(error);
//   }
// };

// // MongoClient.connect(process.env.MONGO)
// //   .then((client) => {
// //     logger.info("Connected to MongoDB");
// //     client.db().collection("feedbacks").insertOne(req.body);
// //     client.close();
// //   })
// //   .catch((err) => logger.error(err));
