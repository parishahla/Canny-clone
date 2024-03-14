import mongoose from "mongoose";
import dotenv from "dotenv";
import App from "./server.js";
import logger from "./logger/logger.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    logger.info("Connected to MongoDB - API - 2.0.0 - Mongoose ");
  })
  .catch((err) => logger.error(err));

App.start(process.env.PORT);

// // 1) Middlewares
// const app = express();
// app.use(bodyParser.json());

//* Router class
// app.use("/api/v2/users", routerInstance.getRouter());
// app.use("/api/v2/feedback", feedbackRouterV2);

//* Logger( Morgan )
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

//* Handle
// app.all("*", (req, res, next) => {
//   const err = new Error(`Can not find ${req.originalUrl} on this server`);
//   err.status = "fail";
//   err.statusCode = 404;
//   next(err);
// next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
// });

// const port = 2000;

// app.listen(port, () => {
//   logger.info(`app listening`);
// });
