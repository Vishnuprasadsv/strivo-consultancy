import express from "express";

import {
    createInquiry,
    getInquiries,
    updateInquiryStatus,
    sendReply,
    getNewInquiries,
    deleteInquiry,
    getInquiriesEvents,
    deleteAllInquiries
} from "../controllers/inquiryController.js";
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/events", protect, authorize('Admin', 'Administrator'), getInquiriesEvents);

router.post("/", createInquiry); // Public route for visitors

router.get("/", protect, authorize('Admin', 'Administrator'), getInquiries);

router.get(
  "/notifications",
  protect,
  authorize('Admin', 'Administrator'),
  getNewInquiries
);

router.put("/:id", protect, authorize('Admin', 'Administrator'), updateInquiryStatus);

router.post("/reply", protect, authorize('Admin', 'Administrator'), sendReply);

router.delete("/", protect, authorize('Admin', 'Administrator'), deleteAllInquiries);

router.delete("/:id", protect, authorize('Admin', 'Administrator'), deleteInquiry);

export default router;