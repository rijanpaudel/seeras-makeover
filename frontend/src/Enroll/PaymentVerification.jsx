import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';

const PaymentVerification = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  const [enrollment, setEnrollment] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      // Get the pidx from URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const pidx = queryParams.get('pidx');
      
      if (!pidx) {
        setStatus('error');
        setMessage('Invalid payment verification request.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/course-payment/verify', { pidx });
        
        if (response.data.status === 'Completed') {
          setStatus('success');
          setMessage('Payment successful! Your enrollment has been processed.');
          setEnrollment(response.data.enrollment);
          showToast('Payment successful! You are now enrolled in the course.');
        } else {
          setStatus('error');
          setMessage(`Payment verification failed: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify payment.');
      }
    };

    if (user) {
      verifyPayment();
    } else {
      // If user is not logged in, show message and redirect to login
      setStatus('error');
      setMessage('You need to be logged in to verify payment.');
      setTimeout(() => navigate('/login', { state: { from: location } }), 3000);
    }
  }, [location, navigate, showToast, user]);

  const handleGoToCourse = () => {
    if (enrollment && enrollment._id) {
      navigate(`/courses/progress/${enrollment._id}`);
    } else {
      navigate('/courses/enroll');
    }
  };

  const handleGoBack = () => {
    navigate('/courses/enroll');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="bg-green-100 text-green-700 p-3 rounded-full inline-flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button 
              onClick={handleGoToCourse}
              className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              Go to Course
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="bg-red-100 text-red-700 p-3 rounded-full inline-flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button 
              onClick={handleGoBack}
              className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Courses
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;