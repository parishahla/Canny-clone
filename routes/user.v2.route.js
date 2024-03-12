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

// import Validate from "../controllers/validation.js";

class Router {
  constructor() {
    this.router = express.Router();
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.router.post("/signin", login);
    this.router.post("/signup", signup);
    this.router.patch("/resetPassword/:token", resetPassword);
    this.router.post("/forgotPassword", forgotPassword);
    this.router.route("/").get(getAllUsers);
    this.router.route("/").post(createUser);
    this.router.route("/:id").get(getUser);
    this.router.route("/:id").patch(updateUser);
    this.router.route("/:id").delete(deleteUser);
  }
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

// routerInstance.route("/").get(protect, getAllUsers).post(protect, createUser);
// routerInstance
//   .route("/:id")
//   .get(protect, getUser)
//   .patch(protect, updateUser)
//   .delete(protect, deleteUser);

export default new Router();

