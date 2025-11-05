import mongoose from "mongoose";

const smsLogSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'reminder', 'overdue', 'confirmation'
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SMSLog = mongoose.model("SMSLog", smsLogSchema);
export default SMSLog;