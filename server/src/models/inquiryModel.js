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
  enum: ["New", "In Progress", "Responded", "Closed"],
  default: "New",
},

isRead:{
   type:Boolean,
   default:false
}
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inquiry", inquirySchema);