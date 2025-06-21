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
    coursePrice: "",
    modules: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moduleInput, setModuleInput] = useState({ moduleTitle: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/courses/all-course`);
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

  const handleModuleChange = (e) => {
    setModuleInput({ ...moduleInput, [e.target.name]: e.target.value });
  };

  // Add module to the course modules array
  const addModule = () => {
    if (moduleInput.moduleTitle.trim() === "") return; // Ensure module has a title
    setNewCourse({
      ...newCourse,
      modules: [...newCourse.modules, { title: moduleInput.moduleTitle }]
    });
    setModuleInput({ moduleTitle: "" }); // Reset module input
  };
  

  // Remove module by index
  const removeModule = (index) => {
    const updatedModules = newCourse.modules.filter((_, idx) => idx !== index);
    setNewCourse({ ...newCourse, modules: updatedModules });
  };

  const handleAddOrUpdateCourse = async (e) => {
    e.preventDefault();

    const courseData = {
      ...newCourse,
      // Convert these to numbers
      courseDuration: Number(newCourse.courseDuration),
      coursePrice: Number(newCourse.coursePrice),
    };

    if (isEditing) {
      //Edit course
      try {
        await axios.put(`${BASE_URL}/api/courses/edit-course/${newCourse._id}`, courseData);
        await fetchCourses(); //Refresht the courses
        resetForm();
      } catch (error) {
        setError("Error updating course.");
        console.error(error.response?.data || error);
      }
    } else {
      //Add new course
      try {
        await axios.post(`${BASE_URL}/api/courses/add-course`, courseData);
        await fetchCourses();
        resetForm();
      } catch (error) {
        setError("Error adding course.");
        console.error(error.response?.data || error);
      }
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${BASE_URL}/api/courses/delete-course/${id}`);
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
      coursePrice: "",
      modules: []
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
    <div className="container mx-auto px-4 py-8">
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

              {/* Module Management Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
                {newCourse.modules && newCourse.modules.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {newCourse.modules.map((mod, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{mod.title}</span>
                        <button
                          type="button"
                          onClick={() => removeModule(index)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="moduleTitle"
                    placeholder="Module Title"
                    value={moduleInput.moduleTitle}
                    onChange={handleModuleChange}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={addModule}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Add Module
                </button>
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