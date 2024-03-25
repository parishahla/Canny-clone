import mongoose, { Schema } from "mongoose";

const tokenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    default: new Date(Date.now() + 10 * 60 * 1000),
  },
});
//! line 15 - change new Date
const Token = mongoose.model("Token", tokenSchema);

export default Token;
