import Appointment from "../models/Appointments.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

// Get total appointment count
export const totalAppointment = async (req, res) => {
  try {
    const count = await Appointment.countDocuments();
    res.json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching appointment count", error });
  }
};

// Get active customers count
export const totalUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    const growthRate = await calculateCustomerGrowth();
    res.json({ count, growthRate });
  } catch (error) {
    res.status(500).json({ message: "Error fetching active customers", error });
  }
};

// Get ongoing courses count
export const totalCourses = async (req, res) => {
  try {
    const count = await Course.countDocuments();
    const completionRate = await calculateCourseCompletionRate();
    res.json({ count, completionRate });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ongoing courses", error });
  }
};

// Get recent appointments
export const recentAppointments = async (req, res) => {
  try {
    const recentAppointments = await Appointment.find()
      .populate("userId", "fullName") // Fetch only user's fullName
      .populate("subServiceId", "name") // Fetch sub-service name
      .sort({ appointmentDate: -1 }) // Correct sorting field
      .limit(5);

    res.json({ appointments: recentAppointments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching recent appointments", error });
  }
};

// Helper function to calculate customer growth rate
async function calculateCustomerGrowth() {
  return 12.5;
}

// Helper function to calculate course completion rate
async function calculateCourseCompletionRate() {
  const totalCourses = await Course.countDocuments();
  const completedCourses = await Course.countDocuments({ status: "completed" });
  return totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
}
