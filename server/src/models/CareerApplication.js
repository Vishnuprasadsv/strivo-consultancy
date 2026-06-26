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
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CareerApplication", careerApplicationSchema);
