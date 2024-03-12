import mongoose from "mongoose";
import { Schema } from "mongoose";

const voteSchema = new mongoose.Schema(
    {
    feedbackId: {
        type: Schema.Types.ObjectId,
            ref: "Feedback",
    },
        upvotedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        },
});

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
