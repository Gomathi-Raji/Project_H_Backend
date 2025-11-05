import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["utilities", "maintenance", "supplies", "staff", "marketing", "insurance", "other"],
      required: true
    },
    subcategory: { type: String },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    supplier: { type: String },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "credit_card", "check", "online"],
      default: "bank_transfer"
    },
    date: { type: Date, required: true },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "cancelled"],
      default: "pending"
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receipt: { type: String }, // URL to receipt image/file
    notes: { type: String },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;