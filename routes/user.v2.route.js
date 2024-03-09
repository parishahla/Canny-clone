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
// import Validate from "../controllers/validation.js";

const router = express.Router();

//* user routes
router.post("/signup", signup);
router.post("/signin", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.route("/").get(protect, getAllUsers).post(protect, createUser);
router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
