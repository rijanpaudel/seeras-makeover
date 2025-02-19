import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Edit2, Trash2, Clock, BookOpen } from "lucide-react";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseTitle: "",
    courseDescription: "",
    courseDuration: "",
    coursePrice: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateCourse = async (e) => {
    e.preventDefault();

    if (isEditing) {
      //Edit course
      try {
        await axios.put(`http://localhost:5000/api/courses/edit-course/${newCourse._id}`, newCourse);
        await fetchCourses(); //Refresht the courses
        resetForm();
      } catch (error) {
        setError("Error updating course.");
      }
    } else {
      //Add new course
      try {
        await axios.post("http://localhost:5000/api/courses/add-course", newCourse);
        await fetchCourses();
        resetForm();
      } catch (error) {
        setError("Error adding course.");
      }
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/delete-course/${id}`);
        await fetchCourses();
      } catch (error) {
        setError("Error deleting course.");
      }
    }
  };

  const handleEditCourse = (course) => {
    setNewCourse(course);
    setIsEditing(true);
    setIsAddingNew(true);
  };

  const resetForm = () => {
    setNewCourse({
      courseTitle: "",
      courseDescription: "",
      courseDuration: "",
      coursePrice: ""
    });
    setIsAddingNew(false);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-56">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Course Management</h1>
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <PlusCircle size={20} />
            Add New Course
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isAddingNew && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-6">
              {isEditing ? "Edit Course" : "Add New Course"}
            </h2>
            <form onSubmit={handleAddOrUpdateCourse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="courseTitle"
                    placeholder="Enter course title"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    value={newCourse.courseTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Duration (weeks)
                  </label>
                  <input
                    type="text"
                    name="courseDuration"
                    placeholder="e.g., 12"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    value={newCourse.courseDuration}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="courseDescription"
                  placeholder="Enter course description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 h-32"
                  value={newCourse.courseDescription}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Price (Rs)
                </label>
                <input
                  type="text"
                  name="coursePrice"
                  placeholder="Enter course price"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  value={newCourse.coursePrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                >
                  {isEditing ? "Update Course" : "Add Course"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-pink-500" />
                    <h3 className="text-xl font-semibold">{course.courseTitle}</h3>
                  </div>
                  <p className="text-gray-600 max-w-2xl">{course.courseDescription}</p>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={18} />
                      <span>{course.courseDuration} hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-pink-500 font-medium">
                      <span>Rs {course.coursePrice}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCourse(course)}
                    className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            No courses available. Add your first course to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;