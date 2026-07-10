import express from "express";
import { createReview, getAllReviews, deleteReview, updateReviewStatus } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getAllReviews);
router.delete("/:id", deleteReview);
router.put("/:id/status", updateReviewStatus);

export default router;
