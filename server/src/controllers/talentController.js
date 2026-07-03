
// by namitha


import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

const sendAckEmail = async (toEmail, name) => {
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






export const submitTalent = async (req, res) => {
  try {
    const { fullName, email, mobile, category } = req.body;

    if (!fullName || !email || !mobile || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    // Fetch all submissions
    const allSubmissions = await TalentSubmission.find({});

    const cleanStr = (s) => s ? s.trim().toLowerCase().replace(/\s+/g, " ") : "";
    const newNameClean = cleanStr(fullName);
    const newMobileClean = mobile.replace(/\D/g, "").slice(-10);
    const newEmailClean = cleanStr(email);

    // Logging helper
    const logPath = path.join(process.cwd(), "debug_talent.log");
    const logToFile = (msg) => fs.appendFileSync(logPath, msg + "\n");

    logToFile(`\n=== Talent Submission Check: ${new Date().toISOString()} ===`);
    logToFile(`Submitting: Name="${fullName}" (Cleaned: "${newNameClean}"), Mobile="${mobile}" (Cleaned: "${newMobileClean}"), Email="${email}" (Cleaned: "${newEmailClean}")`);
    logToFile(`Total submissions in DB: ${allSubmissions.length}`);

    // Check 1: Check if email already exists
    const duplicateEmail = allSubmissions.find(sub => cleanStr(sub.email) === newEmailClean);
    if (duplicateEmail) {
      logToFile(`MATCH BLOCKED (Email match): DB record email="${duplicateEmail.email}"`);
      return res.status(400).json({
        success: false,
        message: "Resume is already with us. Multiple submissions are not allowed."
      });
    }

    // Check 2: Check if different email, but mobile number and name match
    const duplicateSubmission = allSubmissions.find(sub => {
      const dbNameClean = cleanStr(sub.fullName);
      const dbMobileClean = sub.mobile ? sub.mobile.replace(/\D/g, "").slice(-10) : "";
      const nameMatches = dbNameClean === newNameClean;
      const mobileMatches = dbMobileClean === newMobileClean;
      
      logToFile(`Comparing DB sub ID=${sub._id}: Name="${sub.fullName}" (Cleaned: "${dbNameClean}", Match=${nameMatches}), Mobile="${sub.mobile}" (Cleaned: "${dbMobileClean}", Match=${mobileMatches})`);
      
      return nameMatches && mobileMatches;
    });
    if (duplicateSubmission) {
      logToFile(`MATCH BLOCKED (Name+Mobile match): DB record Name="${duplicateSubmission.fullName}", Mobile="${duplicateSubmission.mobile}"`);
      return res.status(400).json({
        success: false,
        message: "A profile with this name and mobile number is already registered."
      });
    }
    logToFile("ALLOW SUBMISSION: No duplicate profile matches found.");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload your resume" });
    }

    // Requirement 2: Check resume keyword compatibility based on category
    const hasKeywords = await checkKeywordMatch(req.file);
    if (!hasKeywords) {
      return res.status(400).json({
        success: false,
        message: "Job role doesn't match your resume or you are not eligible for this role."
      });
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

  


    const submission = new TalentSubmission({
      fullName,
      email,
      mobile,
      category,
      resumeUrl,
    });
    await submission.save();

   





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







export const getTalentSubmissions = async (req, res) => {
  try {
    const submissions = await TalentSubmission.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error("Error in getTalentSubmissions:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const deleteTalentSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await TalentSubmission.findByIdAndDelete(id);
    
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }
    
    return res.status(200).json({ success: true, message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTalentSubmission:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
