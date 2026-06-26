import express from 'express';
import multer from 'multer';
import { submitTalent } from '../controllers/talentController.js';

const router = express.Router();

// Configure Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


router.post("/submit", upload.single("resume"), submitTalent);

export default router;
