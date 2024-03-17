import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Users",
  },
  token: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});
const Token = mongoose.model("Token", tokenSchema);

export default Token;
