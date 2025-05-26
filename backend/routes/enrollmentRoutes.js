import express from "express";
import { enroll, enrolledCourses, singleEnrollment, updateProgress } from "../controllers/enrollmentController.js";

const router = express.Router();

// Enroll in a course
router.post("/enroll", enroll);

// Get all enrolled courses for a user (populated with course data)
router.get("/user/:userId", enrolledCourses);

// Get a single enrollment by enrollmentId (populated with course data)
router.get("/single/:enrollmentId", singleEnrollment);

// Update progress for an enrollment (populated with course data)
router.put("/progress/:enrollmentId", updateProgress);

export default router;
