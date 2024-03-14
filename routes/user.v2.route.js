import express from "express";
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
import valiateUser from "../middlewares/validation.js";
import schema from "../middlewares/validationSchema.js";
import { uploadPhoto } from "../middlewares/imageUpload.js";

class Router {
  constructor() {
    this.router = express.Router();
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.post("/signup", signup);
    this.post("/signin", login);
    this.post("/forgotPassword", forgotPassword);
    this.post("/", createUser);
    this.patch("/resetPassword/:token", resetPassword);
    this.patch("/:id", updateUser);
    this.get("/", getAllUsers);
    this.get("/:id", getUser);
    this.delete("/:id", deleteUser);
  }
  //! other middlewares: protect, validate, schema, upload img, these should all be passed as optional arguments

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

export default new Router();
