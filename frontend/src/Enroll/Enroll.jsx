import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';

const Enroll = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

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

  // Handle course enrollment button click - Now shows payment confirmation
  const handleEnrollClick = (course) => {
    if (!user) {
      showToast("You must be logged in to enroll.");
      return;
    }

    if (!user?._id) {
      showToast("User session is invalid. Please try logging in again.");
      return;
    }

    setSelectedCourse(course);
    setShowPaymentConfirmation(true);
  };

  // Handle payment confirmation
  const handlePaymentConfirm = async () => {
    if (!selectedCourse || !user?._id) return;
    
    setProcessingPayment(true);
    
    try {
      // Prepare data for Khalti payment
      const paymentData = {
        amount: selectedCourse.coursePrice * 100, // Convert to paisa (Khalti's smallest unit)
        purchase_order_id: `course-${selectedCourse._id}-${Date.now()}`,
        purchase_order_name: `Enrollment: ${selectedCourse.courseTitle}`,
        return_url: `${window.location.origin}/course-payment/verify`,
        website_url: window.location.origin,
        customer_info: {
          name: `${user.firstName} ${user.lastName || ''}`,
          email: user.email,
          phone: user.phoneNumber || ""
        },
        extra: {
          orderData: {
            userId: user._id,
            courseId: selectedCourse._id,
          }
        },
        type: "course-enrollment",
      };

      // Initiate payment with Khalti
      const response = await axios.post(
        "http://localhost:5000/api/course-payment/initiate", 
        paymentData
      );

      // Redirect to Khalti payment page
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to process payment.";
      console.error("Error initiating payment:", error);
      showToast(errorMessage);
      setProcessingPayment(false);
      setShowPaymentConfirmation(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentConfirmation(false);
    setSelectedCourse(null);
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

        {/* Payment Confirmation Modal */}
        {showPaymentConfirmation && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Confirm Enrollment</h3>
              <p className="mb-4">You are about to enroll in:</p>
              <div className="bg-gray-100 p-4 rounded mb-4">
                <h4 className="font-medium">{selectedCourse.courseTitle}</h4>
                <p className="text-gray-600 text-sm mb-2">{selectedCourse.courseDescription}</p>
                <p className="font-medium">Price: Rs {selectedCourse.coursePrice}</p>
              </div>
              <p className="mb-4">You will be redirected to Khalti to complete the payment.</p>
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={handleCancelPayment}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  disabled={processingPayment}
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePaymentConfirm}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                  disabled={processingPayment}
                >
                  {processingPayment ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

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
                    onClick={() => handleEnrollClick(course)}
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