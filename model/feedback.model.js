import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A feedback must have a title"],
      trim: true,
      minlength: [
        10,
        "A feedback title name must have more (or equal) than 10 characters",
      ],
    },
    desc: {
      type: String,
      required: [true, "A feedback must have a description"],
      trim: true,
      minlength: [
        10,
        "A feedback description name must have more (or equal) than 10 characters",
      ],
    },
    image: {
      type: String,
      trim: true,
    },
    vote: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
