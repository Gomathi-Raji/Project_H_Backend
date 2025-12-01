import express from "express";
import {
  getTickets,
  getTicket,
  addTicket,
  updateTicket,
  deleteTicket,
  getTicketStats,
  getTenantTickets,
} from "../controllers/ticketController.js";
import { protect, staffOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, staffOnly, getTickets);
router.get("/stats", protect, staffOnly, getTicketStats);
router.get("/:id", protect, staffOnly, getTicket);
router.post("/", protect, addTicket); // tenants or staff can create
router.put("/:id", protect, staffOnly, updateTicket);
router.delete("/:id", protect, staffOnly, deleteTicket);

// Tenant ticket endpoint
router.get("/tenant/my-tickets", protect, getTenantTickets);

export default router;
