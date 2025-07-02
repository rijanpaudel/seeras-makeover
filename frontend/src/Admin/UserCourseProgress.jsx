import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CheckCircle, Circle } from "lucide-react";

const UserCourseProgress = ({ editable = false }) => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch enrollment details
  const fetchEnrollment = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/enrollments/single/${enrollmentId}`
      );
      const fetched = response.data;
      const moduleCount = fetched.courseId?.modules?.length || 0;
      if (!Array.isArray(fetched.completedModules) || fetched.completedModules.length !== moduleCount) {
        fetched = {
          ...fetched,
          completedModules: Array(moduleCount).fill(false),
        };
      }
      setEnrollment(fetched);
    } catch (err) {
      console.error("Error fetching enrollment:", err);
      setError("Failed to load course progress.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (enrollmentId) {
      fetchEnrollment();
    }
  }, [enrollmentId]);

  // Toggle module completion (only if editable)
  const toggleModule = async (index) => {
    if (!enrollment) return;
    // Ensure the completedModules array is initialized properly
    const moduleCount = enrollment.courseId?.modules?.length || 0;
    let currentCompleted = enrollment.completedModules || [];
    if (currentCompleted.length !== moduleCount) {
      currentCompleted = Array(moduleCount).fill(false);
    }
    const newCompleted = [...currentCompleted].map((comp, idx) =>
      idx === index ? !comp : comp
    );
    const progress = moduleCount
      ? Math.round((newCompleted.filter(Boolean).length / moduleCount) * 100)
      : 0;

    try {
      await axios.put(
        `${BASE_URL}/api/enrollments/progress/${enrollment._id}`,
        { progress, completedModules: newCompleted }
      );
      // Update local state
      setEnrollment((prev) => ({
        ...prev,
        completedModules: newCompleted,
        progress,
      }));
    } catch (err) {
      console.error("Error updating progress", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-gray-600">Loading course progress...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  if (!enrollment || !enrollment.courseId)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No enrollment data found.</p>
      </div>
    );

  const modules = enrollment.courseId.modules || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {enrollment.courseId.courseTitle} - Course Progress
        </h1>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Overall Progress
            </span>
            <span className="text-sm font-medium text-gray-700">
              {enrollment.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${enrollment.progress || 0}%` }}
            ></div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Course Modules
          </h2>
          {modules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 border border-gray-100 rounded-lg shadow-sm bg-gray-50"
                >
                  {enrollment.completedModules &&
                    enrollment.completedModules[index] ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 mr-3" />
                  )}
                  <span className="text-gray-800">{module.title}</span>
                  {editable && (
                    <button
                      onClick={() => toggleModule(index)}
                      className="ml-auto px-2 py-1 text-sm border rounded text-blue-500 hover:text-white hover:bg-blue-500"
                    >
                      {enrollment.completedModules[index] ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No modules available for this course.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCourseProgress;
