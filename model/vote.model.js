import mongoose from "mongoose";
import Schema from "mongoose";

const voteSchema = new mongoose.Schema(
    {
    feedbackId: {
        type: Schema.Types.ObjectId,
            ref: "Feedback",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        },
});

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
