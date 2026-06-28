
// by namitha

import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CareerApplication from '../models/CareerApplication.js';
import Job from '../models/Job.js';
import TalentSubmission from '../models/TalentSubmission.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});






const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
      tls: { rejectUnauthorized: false },
      family: 4,
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





export const applyJob = async (req, res) => {
  try {
    const { fullName, email, mobile, appliedPosition, roleDescription } = req.body;

    if (!fullName || !email || !mobile || !appliedPosition) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

   
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

    let resumeUrl;
    try {
      const result = await streamUpload(req.file);
      resumeUrl = result.secure_url;
    } catch (cloudinaryError) {
      console.warn("Cloudinary upload failed, falling back to local storage:", cloudinaryError.message);
      
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      
      resumeUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    }

   



    const application = new CareerApplication({
      fullName,
      email,
      mobile,
      appliedPosition,
      roleDescription,
      resumeUrl,
    });
    await application.save();

   
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





export const getApplications = async (req, res) => {
  try {
    const applications = await CareerApplication.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("Error in getApplications:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




const sendReferralEmail = async (application) => {
  try {
    const hrEmail = process.env.NOTIFY_EMAIL || 'hr@strivoConsultancy.com';
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email credentials not set. Skipping referral email.");
      return;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hrEmail,
      subject: `[Candidate Referral] ${application.fullName} - ${application.appliedPosition}`,
      text: `Dear HR Team,\n\nWe have referred a candidate for the position of ${application.appliedPosition}.\n\nCandidate Details:\n- Full Name: ${application.fullName}\n- Email: ${application.email}\n- Mobile: ${application.mobile}\n- Position: ${application.appliedPosition}\n\nView Resume: ${application.resumeUrl}\n\nPlease review their application and take necessary actions.\n\nBest regards,\nStrivo Admin Portal`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Referral email sent successfully to ${hrEmail}`);
  } catch (error) {
    console.error("Failed to send referral email:", error.message);
  }
};




export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending, reviewed, accepted, rejected, referred
    
    const application = await CareerApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

 


    if (status === 'referred') {
      await sendReferralEmail(application);
    }
    
    return res.status(200).json({ success: true, message: "Status updated successfully", data: application });
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export const referApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await CareerApplication.findByIdAndUpdate(
      id,
      { status: 'referred' },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    await sendReferralEmail(application);
    
    return res.status(200).json({ success: true, message: "Application successfully referred to HR", data: application });
  } catch (error) {
    console.error("Error in referApplication:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};





export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error in getJobs:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export const createJob = async (req, res) => {
  try {
    const { title, description, department, location, jobType, status } = req.body;
    
    if (!title || !description || !department || !location || !jobType) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    const job = new Job({ title, description, department, location, jobType, status });
    await job.save();
    
    return res.status(201).json({ success: true, message: "Job created successfully", data: job });
  } catch (error) {
    console.error("Error in createJob:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, department, location, jobType, status } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      id,
      { title, description, department, location, jobType, status },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    
    return res.status(200).json({ success: true, message: "Job updated successfully", data: job });
  } catch (error) {
    console.error("Error in updateJob:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};





export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    
    return res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error in deleteJob:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export const getDashboardStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "Active" });
    const totalApplications = await CareerApplication.countDocuments();
    const talentSubmissions = await TalentSubmission.countDocuments();
    const pendingActions = await CareerApplication.countDocuments({ status: "pending" });
    
    return res.status(200).json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        totalApplications,
        talentSubmissions,
        pendingActions
      }
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
