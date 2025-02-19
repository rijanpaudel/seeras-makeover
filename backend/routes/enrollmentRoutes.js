// routes/enrollmentRoutes.js
import express from "express";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const router = express.Router();

// Enroll in a course
router.post("/enroll", async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: "You are already enrolled in this course." });
    }

    const newEnrollment = new Enrollment({
      userId,
      courseId,
    });

    await newEnrollment.save();
    res.status(200).json({ message: "Enrolled successfully", enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course", error });
  }
});

// Get all enrolled courses for a user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await Enrollment.find({ userId }).populate("courseId");
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error });
  }
});

router.put("/progress/:enrollmentId", async (req, res) => {
  const { enrollmentId } = req.params;
  const { progress, completedModules } = req.body;

  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { progress, completedModules },
      { new: true }
    );
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error });
  }
});

router.put("/progress/:enrollmentId", async (req, res) => {
  const { enrollmentId } = req.params;
  const { progress, completedModules } = req.body;

  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { progress, completedModules },
      { new: true }
    );
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error });
  }
});


export default router;
