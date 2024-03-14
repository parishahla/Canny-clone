import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { promisify } from "util";
import sendEmail from "../utils/email.js";
import AppError from "../utils/appError.js";
import logger from "../logger/logger.js";
import UserRepository from "../repositories/user.repo.js";

const signToken = (id) => {
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
    if (await UserRepository.getUserByEmail(req.body.email)) {
      throw new AppError("This email has been taken");
    }

    if (await UserRepository.getUserByUsername(req.body.username)) {
      throw new AppError("This username has been taken");
    }

    const hashedPW = await bcrypt.hash(req.body.password, 12);

    const newData = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPW,
      photo: req.file.filename,
    };
    const newUser = await UserRepository.createUser(newData).catch((err) => console.log(err));

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(201).json({ token, data: { newUser } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  //1- Check if email n pass exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await UserRepository.getUserByEmail(email).catch((err) =>
    logger.error(err),
  );

  const { _id } = user;

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    token,
  });
};

//* Route protector middleware
export const protect = async (req, res, next) => {
  try {
    // 1) get the token
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
    const currentUser = await UserRepository.getUserById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401),
      );
    }

    // GRANT ACCESS
    req.user = currentUser;
    next();
  } catch (err) {
    return new AppError("Protection failed");
  }
};

export const forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;
  const user = await UserRepository.getUserByEmail({ email }).catch((err) => {
    logger.error(err);
    throw new AppError(err, 401);
  });
  //! must be handled differently
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  console.log(resetToken);
  // encrypted
  const newPasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log(newPasswordResetToken);
  const newPasswordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(user);
  const promRes = await UserRepository.updateUser(user._id, {
    $set: {
      passwordResetToken: newPasswordResetToken,
      passwordResetExpires: new Date(newPasswordResetExpires),
    },
  }).catch((err) => logger.error(err));
  console.log("prom res");
  console.log(promRes);

  // //* 3) Send it to user's email
  const message = `Forgot your password? Submit a PATCH request with your new password to /api/v3/users/resetPassword/:, ${resetToken} token please ignore this email!`;

  try {
    await sendEmail({
      email: email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    // delete the token and expiration
    await UserRepository.updateUser(user._id, {
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
    );
  }
};

export const resetPassword = async (req, res, next) => {
  const { email } = req.body.email;
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await UserRepository.getUserForAuth(hashedToken);

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  const hashedPW = await bcrypt.hash(req.body.password, 12);

  // 3) Update the user
  await UserRepository.updateUser(email, {
    password: hashedPW,
    passwordChangedAt: new Date(Date.now()),
    passwordResetToken: undefined,
    passwordResetExpires: undefined,
  }).catch((err) => logger.error(err));

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
};
