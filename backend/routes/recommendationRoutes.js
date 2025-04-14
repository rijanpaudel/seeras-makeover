import express from "express";
import { getRecommendationsForUser } from "../controllers/recommendationController.js";

const router = express.Router();


// GET recommendations for a user
router.get("/:userId", getRecommendationsForUser);

export default router;
