import express from "express";
import { protect, tenantOnly } from "../middleware/authMiddleware.js";
import { getMenu, getMenuByDay } from "../controllers/menuController.js";

const router = express.Router();

// Get weekly menu
router.get("/", protect, tenantOnly, getMenu);

// Get menu for specific day
router.get("/:day", protect, tenantOnly, getMenuByDay);

export default router;