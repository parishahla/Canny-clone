import express from "express";
import http from "node:http";

import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
} from "../controllers/user.v2.controller.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
} from "../controllers/auth.v2.controller.js";
import valiateSignup from "../middlewares/validation.js";
import schema from "../middlewares/validationSchema.js";

class Router {
  constructor() {
    this.router = express.Router();
    this.shema = schema;
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.post("/signup", valiateSignup(req.body, shema, signup));
    this.post("/signin", login);
    this.post("/forgotPassword", forgotPassword); //! 128 - new fields
    this.post("/", createUser);
    this.patch("/resetPassword/:token", resetPassword);
    this.patch("/:id", updateUser);
    this.get("/", getAllUsers);
    this.get("/:id", getUser);
    this.delete("/:id", deleteUser);
  }
  //! chaining routes that have the same address
  //! other middlewares: protect, validate, upload img

  get(path, handler) {
    this.router.get(path, handler);
  }

  post(path, handler) {
    this.router.post(path, handler);
  }

  put(path, handler) {
    this.router.put(path, handler);
  }

  delete(path, handler) {
    this.router.delete(path, handler);
  }

  patch(path, handler) {
    this.router.patch(path, handler);
  }

  getRouter() {
    return this.router;
  }
}

//! chained example
// routerInstance.route("/").get(protect, getAllUsers).post(protect, createUser);
// routerInstance
//   .route("/:id")
//   .get(protect, getUser)
//   .patch(protect, updateUser)
//   .delete(protect, deleteUser);

export default new Router();
