import express from 'express';
import { loginAdmin, registerAdmin, forgotPassword, resetPassword } from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

export default router;
