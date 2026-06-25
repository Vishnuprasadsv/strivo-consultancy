import express from "express";

import {
    createInquiry,
    getInquiries,
    updateInquiryStatus,
    sendReply
} from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/", createInquiry);

router.get("/", getInquiries);

router.put("/:id", updateInquiryStatus);

router.post("/reply", sendReply);

export default router;