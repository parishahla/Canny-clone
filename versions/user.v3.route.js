import express from "express";

import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
} from "./user.v3.controller.js";
import {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
} from "./auth.v3.controller.js";

const router = express.Router();

//* user routes
router.post("/signup", signup);
router.post("/signin", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router
  .route("/")
  .get(protect, getAllUsers)
  .post(protect, uploadUserPhoto, createUser);
router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, uploadUserPhoto, updateUser)
  .delete(protect, deleteUser);

export default router;
