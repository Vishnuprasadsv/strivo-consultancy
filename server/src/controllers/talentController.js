import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TalentSubmission from '../models/TalentSubmission.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAckEmail = async (toEmail, name) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email credentials not set. Skipping acknowledgement email.");
      return;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Received Your Resume - Strivo Consultancy Talent Network`,
      text: `Dear ${name},\n\nThank you for submitting your resume to the Strivo Consultancy Talent Network. We have successfully received it. If a suitable opportunity arises, our team will be in touch!\n\nBest regards,\nStrivo Consultancy HR Team`,
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

// @desc    Submit resume to talent network
// @route   POST /api/talent/submit
// @access  Public
export const submitTalent = async (req, res) => {
  try {
    const { fullName, email, mobile, category } = req.body;

    if (!fullName || !email || !mobile || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if the candidate's resume/profile is already submitted
    const existingSubmission = await TalentSubmission.findOne({ email });
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "Resume is already with us, we will contact you."
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
    const submission = new TalentSubmission({
      fullName,
      email,
      mobile,
      category,
      resumeUrl,
    });
    await submission.save();

    // 3. Send Acknowledgment Email
    await sendAckEmail(email, fullName);

    return res.status(201).json({
      success: true,
      message: "Profile submitted successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Error in submitTalent controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
