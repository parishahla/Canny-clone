import Vote from "../model/vote.model";
import { Jwt } from "jsonwebtoken";
import { promisify } from "util";

// export const sendUpvote = async (req, res, next) => {
//     try {
//       const upvotedFeedback = await Feedback.findByIdAndUpdate(
//         req.params.id,
//         { $inc: { vote: 1 } },
//         {
//           new: true,
//           runValidators: true,
//         },
//       );
//       // { $set: { upvoters: (req.user._id), { $inc: { vote: 1 } }
  
//       res.status(201).json(upvotedFeedback);
//     } catch (error) {
//       next(error);
//     }
//   };
  
//   //! How to sppress downvote, when less than 0
//   export const sendDownvote = async (req, res, next) => {
//     try {
//       // const downvotedFeedback = await Feedback.findByIdAndUpdate(
//       //   req.params.id,
//       //   { $inc: { vote: -1 } },
//       //   {
//       //     new: true,
//       //   },
//       // );
//       const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
//       // res.status(201).json(downvotedFeedback);
//     } catch (error) {
//       next(error);
//     }
//   };
  