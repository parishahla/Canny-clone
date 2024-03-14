import express from "express";
import Fastify from "fastify";
import bodyParser from "body-parser";
import morgan from "morgan";
import bodyParser from "body-parser";
import feedbackRouterV2 from "./routes/feedback.v2.route.js";
import routerInstance from "./routes/user.v2.route.js";
import errorController from "./controllers/error.controller.js";
import logger from "./logger/logger.js";

class App {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.requestLogger();
    this.handleError();
    this.setupRoutes();
  }

  setupRoutes() {
    //? The order would not be recognized when calling the function in app.js, but why?
    this.app.use("/api/v2/users", routerInstance.getRouter());
    this.app.use("/api/v2/feedback", feedbackRouterV2);
  }

  requestLogger() {
    this.app.use(morgan("dev"));
  }

  handleError() {
    this.app.use(errorController);
  }

  start(port) {
    this.app.listen(port, () => {
      logger.info("Server is now listening on Express");
    });
  }
}

export default new App();

// fastify methods = get, 
// fastify.listen({ port: 3000 }, (err, address) => {
//   if (err) throw err;
//   console.log("Server is now listening on Fastify");
// });

// 1) Middlewares - plain code 
// const app = express();
// app.use(express.json());

// //* Router class
// app.use("/api/v2/users", routerInstance.getRouter());
// app.use("/api/v2/feedback", feedbackRouterV2);

// //* Logger( Morgan )
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// //* Error handling - global
// app.use(errorController);

// //* Handle
// app.all("*", (req, res, next) => {
//   const err = new Error(`Can not find ${req.originalUrl} on this server`);
//   err.status = "fail";
//   err.statusCode = 404;
//   next(err);
//   // next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
// });

// const port = 2000;

// app.listen(port, () => {
//   logger.info(`app listening`);
// });
