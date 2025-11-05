import mongoose from "mongoose";

const vacatingRequestSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    vacatingDate: { type: Date, required: true },
    reason: { type: String, required: true },
    additionalNotes: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvalDate: { type: Date },
    rejectionReason: { type: String },
    finalSettlementAmount: { type: Number },
    securityDepositRefund: { type: Number },
  },
  { timestamps: true }
);

const VacatingRequest = mongoose.model("VacatingRequest", vacatingRequestSchema);
export default VacatingRequest;