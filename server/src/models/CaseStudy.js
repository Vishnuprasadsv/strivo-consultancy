import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    authorRole: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
    },

    publicationDate: {
      type: Date,
    },

    summary: {
      type: String,
      required: true,
    },

    challenges: {
      type: String,
      required: true,
    },

    results: {
      type: String,
      required: true,
    },

    authorWebsite: {
      type: String,
    },

    coverImage: {
      type: String,
    },

    authorImage: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CaseStudy", caseStudySchema);