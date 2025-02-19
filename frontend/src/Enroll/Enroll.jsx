import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Enroll = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses/all-course");
        setCourses(response.data);
      } catch (error) {
        setError("Failed to load courses.");
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch enrolled courses
  useEffect(() => {
    if (user?._id) {
      const fetchEnrolledCourses = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/enrollments/user/${user._id}`);
          setEnrolledCourses(response.data);
        } catch (error) {
          console.error("Error fetching enrolled courses:", error);
          setError("Failed to fetch enrolled courses.");
        }
      };

      fetchEnrolledCourses();
    } else {
      console.log("User is not logged in.");
    }
  }, [user]);

  // Handle course enrollment
  const handleEnroll = async (courseId) => {
    console.log("Enrollment attempt: ", { user, courseId });

    if(!user){
      console.log("No user object found");
      alert("You must be logged in to enroll.");
      return;
    }

    if (!user?._id) {
      console.log("User object found but no _id:", user);
      alert("User session is invalid. Please try logging in again.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/enrollments/enroll", {
        userId: user._id,
        courseId,
      });

      console.log("Enrollment successful: ", response.data);

      // Refresh enrolled courses after successful enrollment
      const updatedEnrollmentsResponse = await axios.get(
        `http://localhost:5000/api/enrollments/user/${user._id}`
      );
      setEnrolledCourses(updatedEnrollmentsResponse.data);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to enroll in the course.";
      console.error("Error enrolling in course:", error);
      setError(errorMessage);
    }
  };

  // Check if user is enrolled in a course
  const isEnrolled = (courseId) => {
    return enrolledCourses.some(
      enrollment => enrollment.courseId?._id === courseId
    );
  };

  // Handle progress update
  const updateProgress = async (courseId, moduleIndex) => {
    // Implement progress update logic here
    console.log(`Updating progress for course ${courseId}, module ${moduleIndex}`);
    // You'll need to add an API endpoint and backend logic for this
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Beauty Courses
        </h1>

        {/* Available Courses Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Available Courses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.courseTitle}</h3>
                <p className="text-gray-600 mb-4">{course.courseDescription}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-pink-600">
                    Duration: {course.courseDuration} weeks
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-black">
                    Price: Rs {course.coursePrice} 
                  </span>
                </div>
                <button 
                  onClick={() => window.location.href = `/courses/${course._id}`} 
                  disabled={isEnrolled(course._id)}
                  className={`w-full py-2 rounded-md transition-colors ${
                    isEnrolled(course._id)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-pink-600 hover:bg-pink-700 text-white'
                  }`}
                >
                  {isEnrolled(course._id) ? 'View Course' : 'Enroll Now'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Enrolled Courses Section */}
        {enrolledCourses.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {enrolledCourses.map((enrollment) => (
                <div key={enrollment._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {enrollment.courseTitle}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        Enrolled on: {enrollment.enrolledDate}
                      </p>
                    </div>
                    <span className="text-pink-600 font-semibold">
                      {enrollment.progress}% Completed
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-pink-600 h-2 rounded-full" 
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>

                  {/* Course Modules */}
                  {enrollment.modules?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Course Modules:</h4>
                      {enrollment.modules.map((module, index) => (
                        <label 
                          key={index} 
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={module.completed || false}
                            onChange={() => updateProgress(enrollment._id, index)}
                            className="form-checkbox h-5 w-5 text-pink-600 rounded"
                          />
                          <span className={`text-gray-600 ${
                            module.completed ? 'line-through text-gray-400' : ''
                          }`}>
                            {module.title || module}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Enroll;