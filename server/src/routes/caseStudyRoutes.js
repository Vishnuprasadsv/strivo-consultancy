import express from "express";
import {
    createCaseStudy,
    getCaseStudies,
    getCaseStudy,
    updateCaseStudy,
    deleteCaseStudy
} from "../controllers/caseStudyController.js";
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", protect, authorize('Admin', 'Administrator'), createCaseStudy);

router.get("/", getCaseStudies); // Public

router.get("/:id", getCaseStudy); // Public

router.put("/:id", protect, authorize('Admin', 'Administrator'), updateCaseStudy);

router.delete("/:id", protect, authorize('Admin', 'Administrator'), deleteCaseStudy);

export default router;