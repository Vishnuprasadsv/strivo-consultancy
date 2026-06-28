import express from 'express';
import { loginAdmin, registerAdmin, forgotPassword, verifyOtp, resetPassword, changePassword, uploadProfileImage } from '../controllers/adminController.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.put('/reset-password', resetPassword);
router.put('/change-password', changePassword);
router.put('/profile-image', upload.single('image'), uploadProfileImage);

export default router;
