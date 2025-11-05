import express from "express";
import { register, login, logout, updateUserTenant, getUserProfile, updateUserProfile, changePassword, updateUserSettings } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.put("/update-tenant", updateUserTenant);

// User settings routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.put("/settings", protect, updateUserSettings);

export default router;
