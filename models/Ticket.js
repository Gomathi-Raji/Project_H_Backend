import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    category: { type: String, enum: ["technical", "payment", "maintenance", "complaint", "security", "plumbing", "other"], default: "other" },
    notes: { type: String },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
