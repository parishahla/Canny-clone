import express from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.v3.controller.js";
import { signup, login, protect } from "../controllers/auth.v3.controller.js";
import { forgotPassword } from "../controllers/auth.v3.controller.js";
const router = express.Router();

//* user routes
router.post("/signup", signup);
router.post("/signin", login);

router.post("/forgotPassword", forgotPassword);

router.route("/").get(protect, getAllUsers).post(protect, createUser);
router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
