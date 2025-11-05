import express from "express";
import {
  getRooms,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom,
  getRoomStats,
} from "../controllers/roomController.js";
import { protect, staffOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getRooms);
router.get("/stats", protect, getRoomStats);
router.get("/:id", protect, getRoom);
// staff or admin can manage rooms
router.post("/", protect, staffOnly, addRoom);
router.put("/:id", protect, staffOnly, updateRoom);
router.delete("/:id", protect, staffOnly, deleteRoom);

export default router;
