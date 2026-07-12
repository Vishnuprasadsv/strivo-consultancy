import express from 'express';
import multer from 'multer';
import { submitTalent, getTalentSubmissions, deleteTalentSubmission } from '../controllers/talentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


router.post("/submit", upload.single("resume"), submitTalent);


router.get("/submissions", protect, authorize('Admin', 'Administrator', 'Hr'), getTalentSubmissions);
router.delete("/submissions/:id", protect, authorize('Admin', 'Administrator', 'Hr'), deleteTalentSubmission);

export default router;
