import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// Add New Course
router.post("/add-course", async (req, res) => {
  try {
    const { courseTitle, courseDescription, courseDuration, coursePrice } = req.body;
    const newCourse = new Course({ courseTitle, courseDescription, courseDuration, coursePrice });
    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error });
  }
});

// Edit Course
router.put("/edit-course/:id", async (req, res) => {
  try {
    const { courseTitle, courseDescription, courseDuration, coursePrice } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { courseTitle, courseDescription, courseDuration, coursePrice },
      { new: true }
    );
    res.status(200).json({ message: "Course updated successfully!", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});

// Delete Course
router.delete("/delete-course/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});


//Get all course
router.get("/all-course", async (req, res) => {
  try {
    const course = await Course.find();
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching courses", error });
  }
});

export default router;