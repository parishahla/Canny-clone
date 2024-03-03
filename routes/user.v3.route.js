import express from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.v3.controller.js";
import { signup, login, protect } from "../controllers/auth.v3.controller.js";

const router = express.Router();

//* user routes
router.post("/signup", signup);
router.post("/signin", login);

router.route("/").get(protect, getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
