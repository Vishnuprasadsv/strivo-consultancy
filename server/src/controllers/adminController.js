import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot password (Mocked for testing)
// @route   POST /api/admin/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { username } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // In a real app, generate a reset token, save to DB with expiry, and send via Email
    // For now, we just generate a JWT for reset and return it in response (mocking email)
    const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    res.json({ 
      message: 'Password reset link sent (mocked)', 
      resetToken // Important: Sending to client for easy testing without email
    });
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

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: 'Invalid token or admin not found' });
    }

    // Hash and update password
    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
  }
};
