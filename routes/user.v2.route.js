import express from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.v2.controller.js";
import { signup, login, protect } from "../controllers/auth.v2.controller.js";
import Validate from "../controllers/validation.js";

const router = express.Router();

//* user routes
router.post("/signup", Validate.validateUserInput, signup);
router.post("/signin", login);

router
  .route("/")
  .get(protect, getAllUsers)
  .post(protect, Validate.validateUserInput, createUser);
router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
