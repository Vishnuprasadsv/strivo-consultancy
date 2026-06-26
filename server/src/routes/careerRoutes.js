import express from 'express';
import multer from 'multer';
import { applyJob } from '../controllers/careerController.js';

const router = express.Router();

// Configure Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


router.post("/apply", upload.single("resume"), applyJob);

export default router;
