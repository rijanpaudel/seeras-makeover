import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseDescription: { type: String, required: true },
  courseDuration: { type: Number, required: true },
  coursePrice: { type: Number, required: true, default: 0 },
  modules: [
    {
      title: { type: String, required: true },
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
