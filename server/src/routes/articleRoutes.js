import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  subscribeEmail,
} from "../controllers/articleController.js";

const router = express.Router();

// Define Article routes
// These are mounted at '/api/articles' in index.js

// 1. Create a new article: POST /api/articles
router.post("/", createArticle);

// 2. Fetch all articles: GET /api/articles
router.get("/", getArticles);

// 3. Register a new email subscriber: POST /api/articles/subscribe
router.post("/subscribe", subscribeEmail);

// 4. Fetch single article details by ID: GET /api/articles/:id
router.get("/:id", getArticleById);

// 5. Update an existing article: PUT /api/articles/:id
router.put("/:id", updateArticle);

// 6. Delete an article: DELETE /api/articles/:id
router.delete("/:id", deleteArticle);

export default router;
