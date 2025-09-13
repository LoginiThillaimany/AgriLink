import express from "express";
import { getProfile, updateProfile, login } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/login", login);

export default router;