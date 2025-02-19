import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserCourseProgress = () => {
  const { userId } = useParams();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/enrollments/user/${userId}`);
        setEnrollments(response.data);
      } catch (err) {
        setError("Failed to load enrollment data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userId]);

  if (loading) return <p>Loading progress...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Course Progress for User: {userId}</h1>
      {/* Render enrollment data here */}
      {enrollments.length === 0 ? (
        <p>No enrollments found for this user.</p>
      ) : (
        enrollments.map((enrollment) => (
          <div key={enrollment._id} className="border p-4 mb-4 rounded">
            <h2 className="text-2xl font-semibold">{enrollment.courseId.courseTitle}</h2>
            <p>Enrolled on: {new Date(enrollment.enrolledDate).toLocaleDateString()}</p>
            <p>Progress: {enrollment.progress}%</p>
            {/* List modules and completion checkboxes here */}
          </div>
        ))
      )}
    </div>
  );
};

export default UserCourseProgress;
