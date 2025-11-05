import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "card", "online", "bank_transfer", "check"], default: "online" },
    paidAt: { type: Date, default: Date.now },
    notes: { type: String },
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "completed" },
    reference: { type: String }, // Payment reference/transaction ID
    dueDate: { type: Date }, // For scheduled payments
    type: { type: String, enum: ["rent", "deposit", "maintenance", "other"], default: "rent" },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
