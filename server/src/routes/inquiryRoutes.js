import express from "express";

import {
    createInquiry,
    getInquiries,
    updateInquiryStatus,
    sendReply,
    getNewInquiries
} from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/", createInquiry);

router.get("/", getInquiries);

router.get(

"/notifications",

getNewInquiries
)

router.put("/:id", updateInquiryStatus);

router.post("/reply", sendReply);

export default router;