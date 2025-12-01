import express from "express";
import {
  getPayments,
  getPayment,
  addPayment,
  updatePayment,
  deletePayment,
  getPaymentStats,
  getTenantPayments,
} from "../controllers/paymentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getPayments);
router.get("/stats", protect, adminOnly, getPaymentStats);
router.get("/:id", protect, adminOnly, getPayment);
router.post("/", protect, adminOnly, addPayment);
router.put("/:id", protect, adminOnly, updatePayment);
router.delete("/:id", protect, adminOnly, deletePayment);

// Tenant payment/invoice endpoint
router.get("/tenant/my-payments", protect, getTenantPayments);

export default router;
