
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
import { checkKeywordMatch } from '../utils/resumeParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});






const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
      tls: { rejectUnauthorized: false },
      family: 4,
  auth: {
    user: process.env.EMAIL_USER || process.env.EMAIL,
    pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
  },
});



const sendAckEmail = async (toEmail, name, position) => {
  try {
    const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
    const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
    if (!emailUser || !emailPass) {
      console.log("Email credentials not set. Skipping acknowledgement email.");
      return;
    }
    const mailOptions = {
      from: emailUser,
      to: toEmail,
      subject: `Application Received: ${position} at Strivo Consultancy`,
      text: `Dear ${name},\n\nThank you for applying for the ${position} role at Strivo Consultancy. We have successfully received your application and resume. Our team will review your profile and get back to you shortly.\n\nBest regards,\nStrivo Consultancy HR Team`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
};




const streamUpload = (file, applicantName) => {
  return new Promise((resolve, reject) => {
    const cleanName = applicantName ? applicantName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : 'applicant';
    const fileName = `${cleanName}_resume_${Date.now()}`;
    const stream = cloudinary.uploader.upload_stream(
      { 
        resource_type: "auto", 
        folder: "strivo_resumes",
        public_id: fileName
      },
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

    // Fetch all applications for this position
    const allApplications = await CareerApplication.find({ appliedPosition });

    const cleanStr = (s) => s ? s.trim().toLowerCase().replace(/\s+/g, " ") : "";
    const newNameClean = cleanStr(fullName);
    const newMobileClean = mobile.replace(/\D/g, "").slice(-10);
    const newEmailClean = cleanStr(email);

    // Logging helper
    const logToFile = (msg) => console.log(msg);

    logToFile(`\n=== Career Application Check: ${new Date().toISOString()} ===`);
    logToFile(`Position: "${appliedPosition}"`);
    logToFile(`Submitting: Name="${fullName}" (Cleaned: "${newNameClean}"), Mobile="${mobile}" (Cleaned: "${newMobileClean}"), Email="${email}" (Cleaned: "${newEmailClean}")`);
    logToFile(`Total applications for this position in DB: ${allApplications.length}`);

    // Check 1: Check if email already applied for this position
    const duplicateEmail = allApplications.find(app => cleanStr(app.email) === newEmailClean);
    if (duplicateEmail) {
      logToFile(`MATCH BLOCKED (Email match): DB record email="${duplicateEmail.email}"`);
      return res.status(400).json({
        success: false,
        message: `You have already applied for the ${appliedPosition} role.`
      });
    }

    // Check 2: Check if different email, but mobile number and name match for this position
    const duplicateApp = allApplications.find(app => {
      const dbNameClean = cleanStr(app.fullName);
      const dbMobileClean = app.mobile ? app.mobile.replace(/\D/g, "").slice(-10) : "";
      const nameMatches = dbNameClean === newNameClean;
      const mobileMatches = dbMobileClean === newMobileClean;
      
      logToFile(`Comparing DB app ID=${app._id}: Name="${app.fullName}" (Cleaned: "${dbNameClean}", Match=${nameMatches}), Mobile="${app.mobile}" (Cleaned: "${dbMobileClean}", Match=${mobileMatches})`);
      
      return nameMatches && mobileMatches;
    });
    if (duplicateApp) {
      logToFile(`MATCH BLOCKED (Name+Mobile match): DB record Name="${duplicateApp.fullName}", Mobile="${duplicateApp.mobile}"`);
      return res.status(400).json({
        success: false,
        message: `An application with this name and mobile number has already been submitted for the ${appliedPosition} role.`
      });
    }
    logToFile("ALLOW SUBMISSION: No duplicate application matches found.");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload your resume" });
    }

    // Requirement 2: Check resume keyword compatibility
    const hasKeywords = await checkKeywordMatch(req.file);
    if (!hasKeywords) {
      return res.status(400).json({
        success: false,
        message: "Job role doesn't match your resume or you are not eligible for this role."
      });
    }

    let resumeUrl;
    try {
      const result = await streamUpload(req.file, fullName);
      resumeUrl = result.secure_url;
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to upload resume to Cloudinary. Please try again later." 
      });
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
    const hrEmail = process.env.NOTIFY_EMAIL || 'hrstrivo@gmail.com';
    const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
    const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
    if (!emailUser || !emailPass) {
      console.log("Email credentials not set. Skipping referral email.");
      return;
    }
    const mailOptions = {
      from: emailUser,
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


export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await CareerApplication.findByIdAndDelete(id);
    
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    
    return res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error in deleteApplication:", error);
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
