import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { promisify } from "util";
import AppError from "../utils/appError.js";
import logger from "../logger/logger.js";
import { getDb } from "../db.js";
import { ObjectId } from "mongodb";

// const signToken = (id) => {
//   jwt.sign({ id }, process.env.JWT_SECRET);
// };

async function correctPassword(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

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
    console.log(email, password);
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

    console.log(currentUser);
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
