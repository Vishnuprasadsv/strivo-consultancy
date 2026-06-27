import express from "express";



import {

    createCaseStudy,
    getCaseStudies,
    getCaseStudy,
    updateCaseStudy,
    deleteCaseStudy

} from "../controllers/caseStudyController.js";

const router = express.Router();
router.post("/", createCaseStudy);

router.get("/", getCaseStudies);

router.get("/:id", getCaseStudy);

router.put("/:id", updateCaseStudy);

router.delete("/:id", deleteCaseStudy);

export default router;