import mongoose from "mongoose";

// Schema to store email subscriptions for Strivo Consultancy insights
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true, // Ensure the email is registered only once
      trim: true,
      lowercase: true, // Auto-normalize email casing
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Subscriber", subscriberSchema);
