import mongoose from "mongoose";
// import isEmail from "validator";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please set your username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      // validate: [isEmail(), "Please provide a valid email"],
    },
    photo: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      trim: true,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  // Gaurd clause - only runs when password is modified
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12); // 12 : How much CPU intensive it is

  // No longer needed
  this.passwordConfirm = undefined;

  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
