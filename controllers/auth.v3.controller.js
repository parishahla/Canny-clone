import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import logger from "../logger/logger.js";
import { getDb } from "../db.js";
// import sendEmail from "../utils/email.js";

// const signToken = (id) => {
//   jwt.sign({ id }, process.env.JWT_SECRET);
// };

async function correctPassword(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

// async function createPasswordResetToken(
//   passwordResetToken,
//   passwordResetExpires,
// ) {
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   console.log({ resetToken }, passwordResetToken);


//   return resetToken;
// }

const createSendToken = (user, statusCode, res) => {
  s;
  const id = user._id;
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  //   ),
  //   httpOnly: true,
  // };
  // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

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
            //! User id ? - no token yet
            const id = result.insertedId;
            // const token = signToken(id);

            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });

            res.status(201).json({ token, user: result });
          })
          .catch((err) => {
            logger.error(err);
            res.status(500).json({ message: "Creating the user failed." });
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
      status: "youre logged in",
      token,
    });
    // res.status(201).json({ message: "loggin u in" });
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
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists

    const currentUser = await getDb()
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.id) });

    // console.log(currentUser);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401),
      );
    }

    // GRANT ACCESS
    req.user = currentUser;
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
  // console.log(user);
  // 2) Generate the random reset token

  const resetToken = crypto.randomBytes(32).toString("hex");

  const newPasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const newPasswordResetExpires = Date.now() + 10 * 60 * 1000;

  const chu = await getDb()
    .db()
    .collection("users")
    .updateOne(
      { email: req.body.email },
      {
        $set: {
          passwordResetToken: newPasswordResetToken,
          passwordResetExpires: newPasswordResetExpires,
        },
      },
    );

  console.log(resetToken);
  console.log(chu);

  // 3) Send it to user's email
  // const resetURL = `${req.protocol}://${req.get(
  //   "host",
  // )}/api/v1/users/resetPassword/${resetToken}`;

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: "Your password reset token (valid for 10 min)",
  //     message,
  //   });

  //   res.status(200).json({
  //     status: "success",
  //     message: "Token sent to email!",
  //   });
  // } catch (err) {
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;
  //   await user.save({ validateBeforeSave: false });

  //   return next(
  //     new AppError("There was an error sending the email. Try again later!"),
  //     500,
  //   );
  // }
};

export const resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await getDb()
    .db()
    .collection("users")
    .findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
};

export const updatePassword = async (req, res, next) => {
  // 1) Get user from collection
  const user = await getDb()
    .db()
    .collection("users")
    .findById(req.user.id)
    .select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
};

// .toLowerCase()
