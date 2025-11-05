import mongoose from "mongoose";

const feeBreakdownSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    roomRent: {
      type: Number,
      required: true,
      default: 5000,
    },
    electricityCharges: {
      type: Number,
      required: true,
      default: 800,
    },
    waterCharges: {
      type: Number,
      required: true,
      default: 300,
    },
    maintenance: {
      type: Number,
      required: true,
      default: 500,
    },
    totalMonthlyFee: {
      type: Number,
      required: true,
      default: 6600,
    },
    month: {
      type: String,
      required: true,
      default: () => new Date().toLocaleString('default', { month: 'long' }),
    },
    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

const FeeBreakdown = mongoose.model("FeeBreakdown", feeBreakdownSchema);
export default FeeBreakdown;
