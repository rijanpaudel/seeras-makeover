import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CheckCircle, Circle } from "lucide-react";

const CourseProgress = () => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/enrollments/single/${enrollmentId}`);
        setEnrollment(response.data);
      } catch (err) {
        console.error("Error fetching enrollment:", err);
        setError("Failed to load course progress.");
      } finally {
        setLoading(false);
      }
    };

    if (enrollmentId) {
      fetchEnrollment();
    }
  }, [enrollmentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-gray-600">Loading course progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No enrollment data found.</p>
      </div>
    );
  }

  // Destructure enrollment data (assuming courseId is populated with course data)
  const { courseId, progress, completedModules } = enrollment;

const moduleCount = courseId?.modules?.length || 0;
const completedCount = completedModules?.filter(Boolean).length || 0;
const actualProgress = typeof progress === "number" ? progress : Math.round((completedCount / moduleCount) * 100);


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {courseId.courseTitle} - Course Progress
        </h1>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700">{actualProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-500 h-4 rounded-full" 
              style={{ width: `${actualProgress}%` }}
            ></div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Modules</h2>
          <div className="space-y-4">
            {courseId.modules && courseId.modules.length > 0 ? (
              courseId.modules.map((module, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg shadow-sm">
                  {completedModules && completedModules[index] ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 mr-3" />
                  )}
                  <span className={completedModules && completedModules[index] ? "text-gray-500" : "text-gray-800"}>
                    {module.title || module.name || `Module ${index + 1}`}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No modules available for this course.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
