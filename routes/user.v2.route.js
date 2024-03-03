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
  protect,
  validateEmail,
} from "../controllers/auth.v2.controller.js";

const router = express.Router();

//* user routes
router.post("/signup", validateEmail, signup);
router.post("/signin", protect, login);

router.route("/").get(protect, getAllUsers).post(createUser);
router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
