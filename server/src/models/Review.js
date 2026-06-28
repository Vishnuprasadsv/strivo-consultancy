import mongoose from "mongoose";

// Define the schema (structure) for our Reviews
const reviewSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true, // Automatically removes extra spaces around the name
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
    },
    review: {
      type: String,
      required: [true, "Detailed review text is required"],
      trim: true,
      minlength: [20, "Review must be at least 20 characters long"],
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' fields in our database records
    timestamps: true,
  }
);

// Create and export the model
// This will create a collection called 'reviews' in our MongoDB database
export default mongoose.model("Review", reviewSchema);
