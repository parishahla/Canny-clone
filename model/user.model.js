import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
    },
    passwordConfirm: {
      type: String,
    },
  },
);

const User = mongoose.model("User", userSchema);

export default User;
