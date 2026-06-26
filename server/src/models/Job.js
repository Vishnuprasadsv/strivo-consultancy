import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true, // "Full Time", "Part Time", "Remote", etc.
    },
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
