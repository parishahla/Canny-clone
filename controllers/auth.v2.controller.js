import bcrypt from "bcrypt";
import Mail from "../utils/email.js";
import AppError from "../utils/appError.js";
import logger from "../logger/logger.js";
import UserRepository from "../repositories/user.repo.js";
import { generateToken, isValidToken } from "./token.controller.js";
import TokenRepository from "../repositories/token.repo.js";

async function correctPassword(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

const createSendToken = (userId, statusCode, res) => {
  const token = TokenRepository.signToken(userId);

  res.status(statusCode).json({
    status: "success",
    token,
  });
};

export const signup = async (req, res, next) => {
  try {
    const payload = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };

    //* Check for unique email and username
    if (await UserRepository.getUserByEmail(payload.email)) {
      throw new AppError("This email has been taken");
    }

    if (await UserRepository.getUserByUsername(payload.username)) {
      throw new AppError("This username has been taken");
    }

    const hashedPW = await bcrypt.hash(payload.password, 12);

    const newData = {
      username: payload.username,
      email: payload.email,
      password: hashedPW,
      photo: req.file ? req.file.filename : "default.jpg",
    };

    const newUser = await UserRepository.createUser(newData).catch((err) =>
      logger.error(err),
    );

    const token = TokenRepository.signToken(newUser._id);

    return res.status(201).json({ token, data: { newUser } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  //!get it from payload
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await UserRepository.getUserByEmail(email).catch((err) =>
    logger.error(err),
  );

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = TokenRepository.signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};

//* Route protector middleware
export const protect = async (req, res, next) => {
  try {
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

    const decodedId = await TokenRepository.decodeToken(token).catch((err) => {
      //! JsonWebTokenError handler
      logger.info(err.name);
      return next(
        new AppError(
          "Could not verify your token! Token is either invalid or expired",
          404,
        ),
      );
    });

    const currentUser = await UserRepository.getUserById(decodedId);

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
  const { email } = req.body;

  const user = await UserRepository.getUserByEmail(email).catch((err) => {
    logger.error(err);
    throw new AppError("There is no user with this email address.", 404);
  });

  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  const resetToken = await generateToken(user._id);

  // * 3) Send it to user's email
  const message = `Forgot your password? Submit a PATCH request with your new password to /api/v3/users/resetPassword/:, ${resetToken} token please ignore this email!`;

  Mail.sendEmail(
    email,
    "Your password reset token (valid for 10 min)",
    message,
  );

  //! Refactor sending response - function sendResponse(code, meassage, data, res)
  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
  //! try catch wont work, handle deleting the token diffrently
};

export const resetPassword = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
    token: req.params.token,
  };

  const user = await UserRepository.getUserByEmail(payload.email);

  const isValid = await isValidToken(payload.token, user._id).catch((err) => {
    logger.info(err);
    throw new AppError("Token expired", 404);
  });

  if (!isValid) {
    res.status(404).json({
      status: "fail",
      message: "Token is invalid or has expired",
    });
    throw new AppError("Token is invalid or has expired", 404);
  }

  const hashedPW = await bcrypt.hash(req.body.password, 12);

  await UserRepository.updateUser(user._id, {
    password: hashedPW,
  }).catch((err) => logger.error(err));

  // Log the user in, send JWT
  createSendToken(user._id, 200, res);
};
