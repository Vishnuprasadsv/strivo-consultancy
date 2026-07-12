import express from "express";
import { createReview, getAllReviews, deleteReview, updateReviewStatus } from "../controllers/reviewController.js";
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", createReview); // Public
router.get("/", getAllReviews); // Public
router.delete("/:id", protect, authorize('Admin', 'Administrator'), deleteReview);
router.put("/:id/status", protect, authorize('Admin', 'Administrator'), updateReviewStatus);

export default router;
