import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// Enroll in a course
export const enroll = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "You are already enrolled in this course." });
    }

    // Find the course to get its modules
    const course = await Course.findById(courseId);
    const initialModules = course.modules.map(() => false);

    const newEnrollment = new Enrollment({
      userId,
      courseId,
      completedModules: initialModules,
    });

    await newEnrollment.save();
    res.status(200).json({ message: "Enrolled successfully", enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course", error });
  }
};

// Get all enrolled courses for a user (populated with course data)
export const enrolledCourses = async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await Enrollment.find({ userId }).populate("courseId");
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error });
  }
};

// Get a single enrollment by enrollmentId (populated with course data)
export const singleEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate("courseId");
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found." });
    }
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollment", error: error.message });
  }
};

// Update progress for an enrollment (populated with course data)
export const updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { progress, completedModules } = req.body;

    if (typeof progress !== 'number' || !Array.isArray(completedModules)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { progress, completedModules },
      { new: true }
    ).populate("courseId");

    if(!updatedEnrollment) {
      return res.status(404).json({ message: "Enrollment not found." });
    }

    res.status(200).json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error });
  }
};
