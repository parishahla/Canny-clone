import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";

import feedbackRouter from "./routes/feedback.route.js";
import feedbackRouterV1 from "./routes/feedback.v1.route.js";
import userRouter from "./routes/user.route.js";
import userRouterV1 from "./routes/user.v1.route.js";
import errorController from "./controllers/error.controller.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

// 1) Middlewares
const app = express();

//* Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

//* Error handling - global
app.use(errorController);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* Mounting a new router on a route
app.use("/api/feedback", feedbackRouter);
app.use("/api/v1/feedback", feedbackRouterV1);

app.use("/api/users", userRouter);
app.use("/api/v1/users", userRouterV1);


app.all("*", (req, res, next) => {
  const err = new Error(`Can not find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
  // next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});


// 4) Start server
const port = 2000;
app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});

