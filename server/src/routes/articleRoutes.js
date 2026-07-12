import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  subscribeEmail,
  getSubscribers,
  deleteSubscriber,
} from "../controllers/articleController.js";
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Define Article routes
// These are mounted at '/api/articles' in index.js

// 1. Create a new article: POST /api/articles
router.post("/", protect, authorize('Admin', 'Administrator'), createArticle);

// 2. Fetch all articles: GET /api/articles
router.get("/", getArticles); // Public

// 3. Register a new email subscriber: POST /api/articles/subscribe
router.post("/subscribe", subscribeEmail); // Public

// 4. Fetch all active subscribers: GET /api/articles/subscribers
router.get("/subscribers", protect, authorize('Admin', 'Administrator'), getSubscribers);

// 5. Remove a subscriber by ID: DELETE /api/articles/subscribers/:id
router.delete("/subscribers/:id", protect, authorize('Admin', 'Administrator'), deleteSubscriber);

// 6. Fetch single article details by ID: GET /api/articles/:id
router.get("/:id", getArticleById); // Public

// 7. Update an existing article: PUT /api/articles/:id
router.put("/:id", protect, authorize('Admin', 'Administrator'), updateArticle);

// 8. Delete an article: DELETE /api/articles/:id
router.delete("/:id", protect, authorize('Admin', 'Administrator'), deleteArticle);

export default router;
