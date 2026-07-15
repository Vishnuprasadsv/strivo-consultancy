import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    appliedPosition: {
      type: String,
      required: true,
    },
    roleDescription: {
      type: String,
    },
    resumeUrl: {
      type: String,
      required: true, // Cloudinary secure URL
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "referred", "interview_in_progress", "interview_completed", "awaiting_approval", "appointed", "rejected", "not_fit", "delayed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CareerApplication", careerApplicationSchema);
