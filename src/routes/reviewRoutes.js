import express from "express";
import {
    createReview,
    getUserReviews,
    getUserAverageRating
} from "../controller/reviewController.js";
import { protection } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protection, createReview);
router.get("/:userId", protection, getUserReviews);
router.get("/:userId/average-rating", protection, getUserAverageRating);

export default router;