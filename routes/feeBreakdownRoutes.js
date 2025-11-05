import express from "express";
import { protect, tenantOnly } from "../middleware/authMiddleware.js";
import { getFeeBreakdown, updateFeeBreakdown } from "../controllers/feeBreakdownController.js";

const router = express.Router();

// Get fee breakdown for current tenant
router.get("/", protect, tenantOnly, getFeeBreakdown);

// Update fee breakdown for current tenant
router.put("/", protect, tenantOnly, updateFeeBreakdown);

// Get fee breakdown history for tenant
router.get("/history", protect, tenantOnly, async (req, res) => {
  try {
    const FeeBreakdown = (await import("../models/FeeBreakdown.js")).default;
    const feeBreakdowns = await FeeBreakdown.find({
      tenantId: req.user.tenantId,
    }).sort({ year: -1, month: -1 });

    res.json(feeBreakdowns);
  } catch (error) {
    console.error("Error fetching fee breakdown history:", error);
    res.status(500).json({ message: "Failed to fetch fee breakdown history" });
  }
});

export default router;