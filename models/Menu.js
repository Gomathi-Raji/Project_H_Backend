import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    breakfast: {
      type: String,
      required: true,
      default: "Idli, Sambar, Chutney",
    },
    lunch: {
      type: String,
      required: true,
      default: "Rice, Dal, Vegetable, Roti",
    },
    dinner: {
      type: String,
      required: true,
      default: "Chapati, Curry, Rice",
    },
    snacks: {
      type: String,
      default: "Tea, Biscuits",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
menuSchema.index({ day: 1 });
menuSchema.index({ isActive: 1 });

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
