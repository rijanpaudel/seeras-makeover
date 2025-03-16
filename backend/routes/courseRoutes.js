import express from "express";
import { addCourse, editCourse, deleteCourse, getAllCourse } from '../controllers/courseController.js';

const router = express.Router();

// Add New Course
router.post("/add-course", addCourse);

// Edit Course
router.put("/edit-course/:id", editCourse);

// Delete Course
router.delete("/delete-course/:id", deleteCourse);

//Get all course
router.get("/all-course", getAllCourse);

export default router;