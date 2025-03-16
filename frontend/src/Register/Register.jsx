import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

    else if (formData.password < 6) {
      showToast('Password must have greater than 6 digits');
      return;
    }

    else if (formData.password != formData.confirmPassword) {
      showToast('Password do not match');
      return;
    }

    try {
      //Send form data to backend API
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);

      //Clear form after successfull registration
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
    }
  };


  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
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
              className="w-full bg-pink-500 text-white py-4 rounded-full hover:bg-pink-600"
            >
              Sign up
            </button>
          </form>
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
    </>
  );
};

export default Register;