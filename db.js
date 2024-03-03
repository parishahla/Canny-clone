import { MongoClient } from "mongodb";
import logger from "./logger/logger.js";

let _db;

export const initDb = (callback) => {
  if (_db) {
    logger.info("Database is already initialized");
    return callback(null, _db);
  }
  MongoClient.connect(process.env.MONGO)
    .then((client) => {
      _db = client;
      logger.info("Connected to MongoDB - API - 3.0.0 - pure MongoDB ");
      callback(null, _db);
    })
    .catch((err) => callback(err));
};

export const getDb = () => {
  if (!_db) {
    logger.error("Database not initialzed");
    throw Error("Database not initialzed");
  }
  return _db;
};
