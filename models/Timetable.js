import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    activity: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
timetableSchema.index({ priority: -1 });
timetableSchema.index({ isActive: 1 });

const Timetable = mongoose.model("Timetable", timetableSchema);
export default Timetable;
