import mongoose from "mongoose";

const talentSubmissionSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true, // Cloudinary secure URL
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "contacted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TalentSubmission", talentSubmissionSchema);
