import winston from "winston";

const { combine, json, errors, timestamp } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(errors(), json(), timestamp()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "app-error.log",
      level: "error",
    }),
  ],
  exceptionHandlers: [
    //* Logs uncaught exceptions
    new winston.transports.File({ filename: "exception.log" }),
    new winston.transports.Console(),
  ],
  rejectionHandlers: [
    //* Logs rejected promises
    new winston.transports.File({ filename: "rejections.log" }),
  ],
});

//* production level = info
//* develpment level = debug or silly

export default logger;
// console.log(logger);