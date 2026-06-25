const express = require("express");
const router = express.Router();

const Review = require("../models/Review");


router.post("/", async (req, res) => {
  try {
    const { fullName, company, rating, title, review } = req.body;

    // Check for required fields and execute basic backend validation
    if (!fullName || !company || !rating || !title || !review) {
      return res.status(400).json({
        success: false,
        message: "fullName, company, rating, title, and review are all required.",
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "rating must be a number between 1 and 5.",
      });
    }

    if (review.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "review must be at least 20 characters long.",
      });
    }

    // Create review - status will default to "pending" for moderator review
    const newReview = new Review({
      fullName,
      company,
      rating: numRating,
      title,
      review,
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully! It is pending moderation.",
      data: {
        id: newReview._id,
        fullName: newReview.fullName,
        company: newReview.company,
        rating: newReview.rating,
        title: newReview.title,
        status: newReview.status,
        createdAt: newReview.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/reviews:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


router.get("/", async (req, res) => {
  try {
    // Only return reviews that have been approved by an admin
    const reviews = await Review.find({ status: "approved" }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error in GET /api/reviews:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


// admin venenki use chaitho
router.get("/admin", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error in GET /api/reviews/admin:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "approved", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Review status successfully updated to ${status}`,
      data: updatedReview,
    });
  } catch (error) {
    console.error("Error in PATCH /api/reviews/:id/status:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/reviews/:id:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

module.exports = router;
