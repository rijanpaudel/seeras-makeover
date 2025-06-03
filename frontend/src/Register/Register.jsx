import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../Context/ToastContext';
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  });//formData holds the data entered by user

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [otpMode, setOtpMode] = useState(false); // State to manage OTP mode
  const [otp, setOtp] = useState(''); // State to manage OTP input
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };//This function is called every time there is change in any field

  const handleSubmit = async (event) => {
    event.preventDefault(); //This prevents the page to refresh when user submits the form and 

    if (Object.values(formData).some(value => value.trim() === '')) {
      showToast("Please fill in all the fields.");
    }// This checks if any of the field is empty

    else if (formData.password.length < 6) {
      showToast('Password must have greater than 6 digits');
      return;
    }

    else if (formData.password != formData.confirmPassword) {
      showToast('Password do not match');
      return;
    }

    try {
      //Send form data to backend API
      await axios.post("http://localhost:5000/api/auth/register", formData);
      setRegisteredEmail(formData.email);
      showToast("OTP sent to your email");
      setOtpMode(true);
      //Clear form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
        confirmPassword: ""
      });



    } catch (error) {
      showToast(error.response?.data?.message || "Registration failed. Please try again");
      setIsCreating(false);
    }
    setIsCreating(false);
  };

  const handleOtpVerify = async (event) => {
    event.preventDefault();
    if (!otp.trim()) return showToast("Please enter OTP");

    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: registeredEmail,
        otp: otp
      });

      showToast("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      showToast(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        {!otpMode ? (
          <>
            <h1 className="text-4xl font-bold mb-6">Register</h1>
            <form className='text-xl space-y-5' onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className={`w-full py-4 rounded-full ${isCreating ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                  } text-white`}
              >
                {isCreating ? "Creating account..." : "Sign up"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Enter OTP</h1>
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <input
                type="text"
                placeholder="Enter OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 border rounded"
              />
              <button type="submit" className="w-full bg-green-500 text-white py-4 rounded-full hover:bg-green-600">Verify OTP</button>
            </form>
          </>
        )}
        <div className="mt-4 text-center">
          <p className='text-xl'>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;