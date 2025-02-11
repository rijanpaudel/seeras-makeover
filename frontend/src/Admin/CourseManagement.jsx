import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ courseTitle: "", courseDescription: "", courseDuration: "", coursePrice: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch Courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses/all-course");
      setCourses(response.data);
    } catch (error) {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Change (for text fields)
  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  // Add Course
  const handleAddCourse = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/courses/add-course", newCourse);
      alert("Course Added!");
      fetchCourses();  // Refresh the courses list
    } catch (error) {
      alert("Error adding course.");
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/delete-course/${id}`);
      alert("Course Deleted!");
      fetchCourses();  // Refresh the courses list
    } catch (error) {
      alert("Error deleting course.");
    }
  };

  // Edit Course
  const handleEditCourse = async (id) => {
    const courseToEdit = courses.find(course => course._id === id);
    setNewCourse(courseToEdit); // Pre-fill the form with course details for editing
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Course</h2>
        <form onSubmit={handleAddCourse} className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Course Title"
            name="courseTitle"
            className="border rounded px-4 py-2"
            value={newCourse.courseTitle}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Course Description"
            name="courseDescription"
            className="border rounded px-4 py-2"
            value={newCourse.courseDescription}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Course Duration"
            name="courseDuration"
            className="border rounded px-4 py-2"
            value={newCourse.courseDuration}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Course Price"
            name="coursePrice"
            className="border rounded px-4 py-2"
            value={newCourse.coursePrice}
            onChange={handleChange}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Course
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {courses.map(course => (
          <div key={course.__id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{course.courseTitle}</h3>
              <p className="text-gray-600">{course.courseDuration} hours - Rs {course.coursePrice}</p>
            </div>
            <div className="space-x-2">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => handleEditCourse(course._id)}>
                  Edit
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleDeleteCourse(course._id)}>
                  Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;