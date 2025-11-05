import express from "express";
import { protect, tenantOnly } from "../middleware/authMiddleware.js";
import { getTimetable } from "../controllers/timetableController.js";

const router = express.Router();

// Get hostel timetable
router.get("/", protect, tenantOnly, getTimetable);

export default router;