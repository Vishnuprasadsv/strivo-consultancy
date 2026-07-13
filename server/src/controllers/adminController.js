import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Perform a case-insensitive search matching either username or email
    const admin = await Admin.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { email: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id);

      // Set secure cookie
      res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a new admin or hr
// @route   POST /api/admin/register
// @access  Public
export const registerAdmin = async (req, res) => {
  const { username, email, role, password } = req.body;

  try {
    const targetRole = role === 'Hr' || role === 'HR' ? 'Hr' : 'Admin';

    // Password criteria check (backend validation for safety)
    const minLength = password && password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }

    // Check if user with that role is already registered
    const count = await Admin.countDocuments({ role: targetRole });
    if (count > 0) {
      return res.status(400).json({
        message: `Multiple ${targetRole === 'Hr' ? 'HR' : 'Admin'} registration not allowed`
      });
    }

    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const admin = await Admin.create({
      username,
      email,
      role: targetRole,
      password,
    });

    if (admin) {
      const token = generateToken(admin._id);

      // Set secure cookie
      res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
        token: token,
        message: `${targetRole === 'Hr' ? 'HR' : 'Admin'} registered successfully, please login`
      });
    } else {
      res.status(400).json({ message: 'Invalid registration data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout admin/hr
// @route   POST /api/admin/logout
// @access  Public
export const logoutAdmin = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// @desc    Check registration availability for roles
// @route   GET /api/admin/check-registered
// @access  Public
export const checkAdminRegistered = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments({ role: 'Admin' });
    const hrCount = await Admin.countDocuments({ role: 'Hr' });
    res.json({
      registered: adminCount > 0 && hrCount > 0,
      adminRegistered: adminCount > 0,
      hrRegistered: hrCount > 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot password (Generate OTP and email)
// @route   POST /api/admin/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found with that email' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const salt = await bcrypt.genSalt(10);
    admin.resetPasswordOtp = await bcrypt.hash(otp, salt);
    admin.resetPasswordOtpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    await admin.save();

    // Send Email
    const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
    const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPass) {
      console.log('--- DEVELOPMENT OTP CODE ---');
      console.log(`Email credentials not set. OTP for ${admin.email} is: ${otp}`);
      console.log('----------------------------');
      return res.json({
        message: 'OTP sent successfully (Development Mode: OTP logged to console)',
        otp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        tls: { rejectUnauthorized: false },
        family: 4,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password reset OTP</h2>
          <p>Dear ${admin.email},</p>
          <p>Please use the following One-Time Password (OTP) to complete your verification process:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Note: This OTP is valid for only 5 minutes.</p>
          <p>For your security, please do not share this code with anyone. Strivo Consultancy will never call or email you to ask for your OTP.</p>
          <p>If you did not request this verification code, please ignore this email or immediately contact our support team.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>Strivo Consultancy Private Limited</strong></p>
          <div style="margin-top: 20px;">
            <img src="https://strivo.com/logo.png" alt="Strivo Logo" style="height: 40px;" />
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: emailUser,
        to: admin.email,
        subject: 'Password reset OTP',
        html: emailTemplate,
      });

      res.json({ message: 'OTP sent successfully to email' });
    } catch (emailError) {
      console.error('Failed to send OTP email via SMTP:', emailError.message);
      console.log('--- DEVELOPMENT OTP CODE (SMTP FAILED) ---');
      console.log(`OTP for ${admin.email} is: ${otp}`);
      console.log('------------------------------------------');

      if (process.env.NODE_ENV !== 'production') {
        return res.json({
          message: 'OTP sent successfully (Development Fallback: OTP logged to console)',
          otp: otp
        });
      }
      return res.status(500).json({ message: 'Failed to send OTP email', error: emailError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/admin/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({
      email,
      resetPasswordOtpExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isMatch = await bcrypt.compare(otp, admin.resetPasswordOtp);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Generate a short-lived reset token for the actual password change step
    const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

    res.json({ message: 'OTP verified successfully', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/admin/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: 'Please provide token and new password' });
  }

  // Password criteria check
  const minLength = newPassword && newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: 'Invalid token or admin not found' });
    }

    // Hash and update password
    admin.password = newPassword;
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordOtpExpire = undefined;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/admin/change-password
// @access  Private (protected by protect middleware)
export const changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  // Password criteria check
  const minLength = newPassword && newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    });
  }

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(currentPassword))) {
      admin.password = newPassword;
      await admin.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload profile image
// @route   PUT /api/admin/profile-image
// @access  Public (should ideally be private)
export const uploadProfileImage = async (req, res) => {
  const { username } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.profileImage = req.file.path;
    await admin.save();

    res.json({
      message: 'Profile image updated successfully',
      profileImage: admin.profileImage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify current password
// @route   POST /api/admin/verify-password
// @access  Public
export const verifyPassword = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin && (await admin.matchPassword(password))) {
      res.json({ success: true, message: 'Password matches' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
