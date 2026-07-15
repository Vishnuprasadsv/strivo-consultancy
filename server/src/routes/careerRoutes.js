import express from 'express';
import multer from 'multer';
import {
  applyJob,
  getApplications,
  updateApplicationStatus,
  referApplication,
  deleteApplication,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats,
  sendOfferLetter
} from '../controllers/careerController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


router.post("/apply", upload.single("resume"), applyJob);


router.get("/applications", protect, authorize('Admin', 'Administrator', 'Hr'), getApplications);
router.put("/applications/:id/status", protect, authorize('Admin', 'Administrator', 'Hr'), updateApplicationStatus);
router.put("/applications/:id/refer", protect, authorize('Admin', 'Administrator', 'Hr'), referApplication);
router.post("/applications/:id/send-offer", protect, authorize('Admin', 'Administrator', 'Hr'), sendOfferLetter);
router.delete("/applications/:id", protect, authorize('Admin', 'Administrator', 'Hr'), deleteApplication);


router.get("/jobs", getJobs); // Public
router.post("/jobs", protect, authorize('Admin', 'Administrator', 'Hr'), createJob);
router.put("/jobs/:id", protect, authorize('Admin', 'Administrator', 'Hr'), updateJob);
router.delete("/jobs/:id", protect, authorize('Admin', 'Administrator', 'Hr'), deleteJob);


router.get("/stats", protect, authorize('Admin', 'Administrator'), getDashboardStats);

export default router;
