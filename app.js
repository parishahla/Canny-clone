import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import { initDb } from "./db.js";
import feedbackRouterV1 from "./versions/feedback.v1.route.js";
import feedbackRouterV2 from "./routes/feedback.v2.route.js";
import feedbackRouterV3 from "./versions/feedback.v3.route.js";
import userRouterV1 from "./versions/user.v1.route.js";
import Router from "./routes/user.v2.route.js";
import userRouterV3 from "./versions/user.v3.route.js";
import errorController from "./controllers/error.controller.js";
import logger from "./logger/logger.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    logger.info("Connected to MongoDB - API - 2.0.0 - Mongoose ");
  })
  .catch((err) => logger.error(err));

// 1) Middlewares
const app = express();
// const router = new Router();
// app.use(router.getRouter());

//* Logger( Morgan )
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

//* Error handling - global
app.use(errorController);

//* Mounting a new router on a route
// app.use("/api/v1/feedback", feedbackRouterV1);
// app.use("/api/v2/feedback", feedbackRouterV2);
// app.use("/api/v3/feedback", feedbackRouterV3);

// app.use("/api/v1/users", userRouterV1);
// app.use("/api/v2/users", router.getRouter());
// app.use("/api/v3/users", userRouterV3);

app.all("*", (req, res, next) => {
  const err = new Error(`Can not find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
  // next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

const port = 2000;

app.listen(port, () => {
  console.log(`app listening`);
});

// initDb((err) => {
//   if (err) {
//     logger.error(err);
//   } else {
//     app.listen(process.env.PORT, () => {
//       logger.info(`app listening`);
//     });
//   }
// });
