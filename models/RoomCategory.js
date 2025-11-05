import mongoose from "mongoose";

const roomCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: [{
      type: String,
      required: true,
    }],
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    isAC: {
      type: Boolean,
      default: false,
    },
    hasAttachedBathroom: {
      type: Boolean,
      default: true,
    },
    hasBalcony: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
roomCategorySchema.index({ name: 1 });
roomCategorySchema.index({ price: 1 });
roomCategorySchema.index({ isActive: 1 });

const RoomCategory = mongoose.model("RoomCategory", roomCategorySchema);
export default RoomCategory;