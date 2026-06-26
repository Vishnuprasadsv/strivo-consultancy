import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CareerApplication from '../models/CareerApplication.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);
// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAckEmail = async (toEmail, name, position) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email credentials not set. Skipping acknowledgement email.");
      return;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Application Received: ${position} at Strivo Consultancy`,
      text: `Dear ${name},\n\nThank you for applying for the ${position} role at Strivo Consultancy. We have successfully received your application and resume. Our team will review your profile and get back to you shortly.\n\nBest regards,\nStrivo Consultancy HR Team`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
};

const streamUpload = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "strivo_resumes" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// @desc    Submit a job application (with resume)
// @route   POST /api/career/apply
// @access  Public
export const applyJob = async (req, res) => {
  try {
    const { fullName, email, mobile, appliedPosition, roleDescription } = req.body;

    if (!fullName || !email || !mobile || !appliedPosition) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if the candidate has already applied for this position
    const existingApplication = await CareerApplication.findOne({ email, appliedPosition });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: `You have already applied for the ${appliedPosition} role. We will contact you soon.`
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload your resume" });
    }

    // 1. Upload to Cloudinary with local fallback
    let resumeUrl;
    try {
      const result = await streamUpload(req.file);
      resumeUrl = result.secure_url;
    } catch (cloudinaryError) {
      console.warn("Cloudinary upload failed, falling back to local storage:", cloudinaryError.message);
      
      const uploadsDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      
      resumeUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    }

    // 2. Save to MongoDB
    const application = new CareerApplication({
      fullName,
      email,
      mobile,
      appliedPosition,
      roleDescription,
      resumeUrl,
    });
    await application.save();

    // 3. Send Acknowledgment Email
    await sendAckEmail(email, fullName, appliedPosition);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Error in applyJob controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
