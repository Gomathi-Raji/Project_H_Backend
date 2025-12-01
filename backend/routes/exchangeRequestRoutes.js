import express from "express";
import {
  getExchangeRequests,
  getExchangeRequest,
  getTenantExchangeRequests,
  addExchangeRequest,
  updateExchangeRequest,
  deleteExchangeRequest,
} from "../controllers/exchangeRequestController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.get("/", protect, adminOnly, getExchangeRequests);
router.get("/:id", protect, adminOnly, getExchangeRequest);
router.put("/:id", protect, adminOnly, updateExchangeRequest);
router.delete("/:id", protect, adminOnly, deleteExchangeRequest);

// Tenant routes
router.get("/tenant/my-requests", protect, getTenantExchangeRequests);
router.post("/", protect, addExchangeRequest);

export default router;