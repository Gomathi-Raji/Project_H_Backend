import express from "express";
import {
  getTenants,
  getTenant,
  addTenant,
  updateTenant,
  deleteTenant,
  getTenantStats,
  getTenantDashboard,
  sendSMSToTenants,
  sendManualSMS,
} from "../controllers/tenantController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTenants);
router.get("/stats", protect, adminOnly, getTenantStats);
router.get("/:id", protect, getTenant);
// only admin can add or delete tenants
router.post("/", protect, adminOnly, addTenant);
router.put("/:id", protect, adminOnly, updateTenant);
router.delete("/:id", protect, adminOnly, deleteTenant);

// Tenant dashboard endpoint
router.get("/dashboard/my-info", protect, getTenantDashboard);

// Send SMS to selected tenants
router.post("/send-sms", protect, adminOnly, sendSMSToTenants);

// Send manual SMS to any number
router.post("/send-manual-sms", protect, adminOnly, sendManualSMS);

export default router;
