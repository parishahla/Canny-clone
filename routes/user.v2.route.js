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
  }

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

const routerInstance = new Router();

function logIt() {
  console.log("im being logged");
}

routerInstance.post("/signup", logIt, signup, logIt);
routerInstance.post("/signin", login);

routerInstance.post("/forgotPassword", logIt, forgotPassword);
routerInstance.patch("/resetPassword/:token", resetPassword);

// routerInstance.route("/").get(protect, getAllUsers).post(protect, createUser);
// routerInstance
//   .route("/:id")
//   .get(protect, getUser)
//   .patch(protect, updateUser)
//   .delete(protect, deleteUser);

export default routerInstance;
// export default Router;
