import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Enroll = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

    if (!user) {
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

      const enrollment = updatedEnrollmentsResponse.data.find(enr => enr.courseId?._id === courseId);

      if(enrollment) {
        navigate(`/courses/progress/${enrollment._id}`)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to enroll in the course.";
      console.error("Error enrolling in course:", error);
      setError(errorMessage);
    }
  };

  const getEnrollmentByCourse = (courseId) => {
    return enrolledCourses.find(enrollment => enrollment.courseId?._id === courseId);
  };

  // Check if user is enrolled in a course
  const getEnrollmentId = (courseId) => {
    const enrollment = enrolledCourses.find(
      enrollment => enrollment.courseId?._id === courseId
    );
    return enrollment ? enrollment._id : null;
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
                {getEnrollmentId(course._id) ? (
                  <button 
                    onClick={() => navigate(`/courses/progress/${getEnrollmentId(course._id)}`)}
                    className="w-full py-2 rounded-md bg-gray-400 text-white cursor-pointer"
                  >
                    View Course
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEnroll(course._id)}
                    className="w-full py-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Enroll;