import express from "express";
import { protect, tenantOnly } from "../middleware/authMiddleware.js";
import { getTenantRoomCategory, getRoomCategories } from "../controllers/roomCategoryController.js";

const router = express.Router();

// Get room category information for current tenant
router.get("/", protect, tenantOnly, getTenantRoomCategory);

// Get all available room categories
router.get("/categories", protect, tenantOnly, getRoomCategories);

export default router;