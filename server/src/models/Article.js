import mongoose from "mongoose";

// Define the schema for storing articles published by the admin
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Article category is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Cover image URL is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Short preview description is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Full article content is required"],
      trim: true,
    },
    showSubscription: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically manage createdAt and updatedAt fields for our articles
    timestamps: true,
  }
);

export default mongoose.model("Article", articleSchema);
