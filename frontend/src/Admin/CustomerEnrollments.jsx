import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";

const CustomerEnrollments = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch customer details
        const customerResponse = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
        setCustomer(customerResponse.data);
        
        // Fetch enrollments
        const enrollmentsResponse = await axios.get(`http://localhost:5000/api/enrollments/user/${userId}`);
        setEnrollments(enrollmentsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={() => navigate(`/admin/customer/${userId}`)}
          className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Customer Details
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate(`/admin/customer/${userId}`)} 
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Customer Details
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Course Enrollments</h1>
              {customer && <p className="text-gray-600">Enrollments for {customer.fullName}</p>}
            </div>
          </div>

          {enrollments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">No enrollments found for this customer.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      {enrollment.courseId ? (
                        <>
                          <h2 className="text-xl font-semibold text-gray-800">{enrollment.courseId.courseTitle}</h2>
                          <p className="text-gray-600 mt-1">
                            Enrolled on: {new Date(enrollment.enrolledDate).toLocaleDateString()}
                          </p>
                          {enrollment.status && (
                            <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                              enrollment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              enrollment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                            </span>
                          )}
                        </>
                      ) : (
                        <p className="text-red-500">Enrollment missing course information.</p>
                      )}
                    </div>
                    {enrollment.courseId && (
                      <button
                        onClick={() => navigate(`/admin/course-progress/${enrollment._id}`)}
                        className="mt-4 md:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View Course Progress
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerEnrollments;