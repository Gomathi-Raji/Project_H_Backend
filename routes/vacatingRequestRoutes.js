import express from "express";
import {
  getVacatingRequests,
  getVacatingRequest,
  getTenantVacatingRequests,
  addVacatingRequest,
  updateVacatingRequest,
  deleteVacatingRequest,
} from "../controllers/vacatingRequestController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.get("/", protect, adminOnly, getVacatingRequests);
router.get("/:id", protect, adminOnly, getVacatingRequest);
router.put("/:id", protect, adminOnly, updateVacatingRequest);
router.delete("/:id", protect, adminOnly, deleteVacatingRequest);

// Tenant routes
router.get("/tenant/my-requests", protect, getTenantVacatingRequests);
router.post("/", protect, addVacatingRequest);

export default router;