import Review from "../models/Review.js";

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req, res) => {
  try {
    // 1. Destructure the review details sent from the frontend request body
    const { fullName, company, rating, title, review } = req.body;

    // 2. Validate that all required fields are present
    if (!fullName || !company || rating === undefined || !title || !review) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    // 3. Additional backend validation check for rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5 stars.",
      });
    }

    // 4. Additional backend validation check for review length
    if (review.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Review must be at least 20 characters long.",
      });
    }

    // 5. Create a new instance of our Review model using the destructured fields
    const newReview = new Review({
      fullName,
      company,
      rating,
      title,
      review,
    });

    // 6. Save the new review to our MongoDB database
    const savedReview = await newReview.save();

    // 7. Send a successful response back to the frontend with the saved data
    return res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      data: savedReview,
    });
  } catch (error) {
    // If something goes wrong (e.g. database error), catch it here
    console.error("Error in createReview controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to save review.",
      error: error.message,
    });
  }
};
