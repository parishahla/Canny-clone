import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import logger from "../logger/logger.js";
import { getDb } from "../db.js";
import sendEmail from "../utils/email.js";

// const signToken = (id) => {
//   jwt.sign({ id }, process.env.JWT_SECRET);
// };

async function correctPassword(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}
const createSendToken = (user, statusCode, res) => {
  const id = user._id;
  const token = jwt.sign({ id }, process.env.JWT_SECRET);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = async (req, res, next) => {
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    };

    bcrypt
      .hash(newUser.password, 12)
      .then((hashedPW) => {
        getDb()
          .db()
          .collection("users")
          .insertOne({
            username: req.body.username,
            email: req.body.email,
            password: hashedPW,
          })
          .then((result) => {
            const id = result.insertedId;
            // const token = signToken(id);
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });

            res.status(201).json({ token, user: result });
          })
          .catch((err) => {
            logger.error(err);
            res.status(500).json({
              message:
                "Creating the user failed! Please enter valid credentials.",
            });
          });
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).json({ message: "Creating the user failed." });
      });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //1- Check if email n pass exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await getDb()
      .db()
      .collection("users")
      .findOne({ email: email });

    if (!user || !(await correctPassword(req.body.password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    const { _id } = user;

    // 3) If everything ok, send token to client
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: "You are logged in",
      token,
    });
  } catch (err) {
    logger.error(err);
  }
};

//* Route protector middleware
export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }

    // 2) Verification token
    console.log("token", token);
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log("decoded :::::", decoded);

    // 3) Check if user still exists
    const currentUser = await getDb()
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(decoded._id) });

    console.log("current user", currentUser);
    // console.log(currentUser);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401),
      );
    }

    // GRANT ACCESS
    req.user = currentUser;
    console.log("req.user", req.user);
    next();
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await getDb()
    .db()
    .collection("users")
    .findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // encrypted
  const newPasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const newPasswordResetExpires = Date.now() + 10 * 60 * 1000;

  await getDb()
    .db()
    .collection("users")
    .updateOne(
      { email: req.body.email },
      {
        $set: {
          passwordResetToken: newPasswordResetToken,
          passwordResetExpires: new Date(newPasswordResetExpires),
        },
      },
    );

  // //* 3) Send it to user's email
  const message = `Forgot your password? Submit a PATCH request with your new password to /api/v3/users/resetPassword/:, ${resetToken} token please ignore this email!`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    // delete the token and expiration
    await getDb()
      .db()
      .collection("users")
      .updateOne(
        { email: req.body.email },
        {
          $set: {
            passwordResetToken: undefined,
            passwordResetExpires: undefined,
          },
        },
      );
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
    );
  }
};

export const resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const db = await getDb().db();
  const user = await db.collection("users").findOne({
    $and: [
      { passwordResetToken: hashedToken },
      { passwordResetExpires: { $gt: new Date(Date.now()) } },
    ],
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  const hashedPW = await bcrypt.hash(req.body.password, 12);

  // 3) Update the user
  await db
    .collection("users")
    .updateOne(
      { email: req.body.email },
      {
        $set: {
          password: hashedPW,
          passwordChangedAt: new Date(Date.now()),
          passwordResetToken: undefined,
          passwordResetExpires: undefined,
        },
      },
    )
    .catch((err) => logger.error(err));

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
};
