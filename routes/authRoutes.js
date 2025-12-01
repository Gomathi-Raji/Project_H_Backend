import express from "express";
import { register, login, updateUserTenant, getProfile, updateProfile, updateSettings, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/settings", protect, updateSettings);
router.put("/change-password", protect, changePassword);
router.put("/update-tenant", updateUserTenant);

export default router;
