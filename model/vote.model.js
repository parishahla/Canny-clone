import mongoose from "mongoose";
import { Schema } from "mongoose";
import User from "./user.model";
import Feedback from "./feedback.model";

const voteSchema = new mongoose.Schema({
    feedbackId: {
        type: Schema.Types.ObjectId,
        ref: Feedback,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    upvoteTime: Date.now(), 
});

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;