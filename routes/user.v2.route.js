import express from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.v2.controller.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
} from "../controllers/auth.v2.controller.js";
import validate from "../middlewares/user.joi.validation.js";
import schema from "../middlewares/user.joi.schema.js";
import uploadPhoto from "../middlewares/imageUpload.js";

class Router {
  constructor() {
    this.router = express.Router();
    this.schema = schema;
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.post("/signup", uploadPhoto, validate(this.schema), signup);
    this.post("/signin", login);
    this.post("/forgotPassword", forgotPassword);
    this.post("/", protect, validate(this.schema), createUser);
    this.patch("/resetPassword/:token", resetPassword);
    this.patch("/:id", protect, updateUser);
    this.get("/", protect, getAllUsers);
    this.get("/:id", protect, getUser);
    this.delete("/:id", protect, deleteUser);
  }
  //! other middlewares: protect, validate, schema, upload img, these should all be passed as optional arguments

  get(path, ...handler) {
    this.router.get(path, ...handler);
  }

  post(path, ...handlers) {
    this.router.post(path, ...handlers);
  }

  put(path, ...handler) {
    this.router.put(path, ...handler);
  }

  delete(path, ...handler) {
    this.router.delete(path, ...handler);
  }

  patch(path, ...handler) {
    this.router.patch(path, ...handler);
  }

  getRouter() {
    return this.router;
  }
}

// const routerInstance = new Router();
// routerInstance.post(
//   "/signup",
//   protect,
//   uploadPhoto,
//   validateF(this.schema),
//   signup,
// );

//! chained example
// routerInstance.route("/").get(protect, getAllUsers).post(protect, createUser);
// routerInstance
//   .route("/:id")
//   .get(protect, getUser)
//   .patch(protect, updateUser)
//   .delete(protect, deleteUser);

export default new Router();
