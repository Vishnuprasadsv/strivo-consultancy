// by namitha
import express from 'express';
import multer from 'multer';
import {
  applyJob,
  getApplications,
  updateApplicationStatus,
  referApplication,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats
} from '../controllers/careerController.js';

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


router.post("/apply", upload.single("resume"), applyJob);


router.get("/applications", getApplications);
router.put("/applications/:id/status", updateApplicationStatus);
router.put("/applications/:id/refer", referApplication);


router.get("/jobs", getJobs);
router.post("/jobs", createJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);


router.get("/stats", getDashboardStats);

export default router;
