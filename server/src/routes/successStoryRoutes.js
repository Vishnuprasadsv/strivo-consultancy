import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { createStory, getStories, deleteStory } from '../controllers/successStoryController.js';
import dotenv from 'dotenv';
dotenv.config();

// Fallback to local storage since Cloudinary API Secret is invalid
const uploadDir = path.join(process.cwd(), 'uploads', 'success_stories');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', upload.single('image'), createStory);
router.get('/', getStories);
router.delete('/:id', deleteStory);

export default router;
