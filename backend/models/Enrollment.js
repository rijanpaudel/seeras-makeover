// models/Enrollment.js
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
  progess: {
    type: Number,
    default: 0,
  },
  completedModules: {
    type: [Boolean],
    default: []
  }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
