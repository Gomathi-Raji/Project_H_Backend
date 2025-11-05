import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User account
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    aadharNumber: { type: String },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    moveInDate: { type: Date },
    emergencyContactName: { type: String },
    emergencyContactRelationship: { type: String },
    emergencyContactPhone: { type: String },
    securityDeposit: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Tenant = mongoose.model("Tenant", tenantSchema);
export default Tenant;
