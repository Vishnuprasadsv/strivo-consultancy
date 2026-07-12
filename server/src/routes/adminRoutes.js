import express from 'express';
import { loginAdmin, registerAdmin, logoutAdmin, checkAdminRegistered, forgotPassword, verifyOtp, resetPassword, changePassword, uploadProfileImage, verifyPassword } from '../controllers/adminController.js';
import { upload } from '../config/cloudinary.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/check-registered', checkAdminRegistered);
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.put('/reset-password', resetPassword);
router.put('/change-password', protect, changePassword);
router.put('/profile-image', protect, upload.single('image'), uploadProfileImage);
router.post('/verify-password', protect, verifyPassword);

export default router;
