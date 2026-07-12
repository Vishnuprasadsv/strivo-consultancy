import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    company: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    service: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["New", "In Progress", "Responded", "Proposals", "Closed", "General Inquiry"],
      default: "New",
    },

    assignedTo: {
      type: String,
      default: "Unassigned",
    },

    nextFollowUp: {
      type: Date,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false
    },

    activityLog: [
      {
        action: { type: String, required: true },
        details: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inquiry", inquirySchema);