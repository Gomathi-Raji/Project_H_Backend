import express from "express";
import {
  getExpenses,
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from "../controllers/expenseController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getExpenses);
router.get("/stats", protect, adminOnly, getExpenseStats);
router.get("/:id", protect, getExpense);
router.post("/", protect, adminOnly, addExpense);
router.put("/:id", protect, adminOnly, updateExpense);
router.delete("/:id", protect, adminOnly, deleteExpense);

export default router;