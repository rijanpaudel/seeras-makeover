import Course from "../models/Course.js";

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseTitle, courseDescription, courseDuration, coursePrice, modules } = req.body;
    const newCourse = new Course({ courseTitle, courseDescription, courseDuration, coursePrice, modules });
    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error adding course", error });
  }
};

// Edit Course
export const editCourse = async (req, res) => {
  try {
    const { courseTitle, courseDescription, courseDuration, coursePrice, modules } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { courseTitle, courseDescription, courseDuration, coursePrice, modules },
      { new: true }
    );
    res.status(200).json({ message: "Course updated successfully!", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};


//Get all course
export const getAllCourse = async (req, res) => {
  try {
    const course = await Course.find();
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching courses", error });
  }
};
