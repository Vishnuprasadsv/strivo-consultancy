import express from 'express';
import multer from 'multer';
import { submitTalent, getTalentSubmissions, deleteTalentSubmission } from '../controllers/talentController.js';

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


router.post("/submit", upload.single("resume"), submitTalent);


router.get("/submissions", getTalentSubmissions);
router.delete("/submissions/:id", deleteTalentSubmission);

export default router;
