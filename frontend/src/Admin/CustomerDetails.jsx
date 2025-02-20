import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CustomerDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/enrollments/user/${userId}`);
        setEnrollments(response.data);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setError("Failed to load enrollments.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [userId]);

  if (loading) return <p>Loading enrollments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (enrollments.length === 0) return <p>No enrollments found for this user.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Customer Enrollments</h1>
      <ul className="space-y-4">
        {enrollments.map((enrollment) => (
          <li key={enrollment._id} className="p-4 border rounded shadow flex justify-between items-center">
            <div>
              {enrollment.courseId ? (
                <>
                  <h2 className="text-xl font-semibold">{enrollment.courseId.courseTitle}</h2>
                  <p className="text-gray-600">Enrolled on: {new Date(enrollment.enrolledDate).toLocaleDateString()}</p>
                </>
              ) : (
                <p className="text-red-500">Enrollment missing course information.</p>
              )}
            </div>
            {enrollment.courseId && (
            <button
              onClick={() => navigate(`/admin/course-progress/${enrollment._id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              View Course Progress
            </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDetails;
