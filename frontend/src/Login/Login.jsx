import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { showToast } = useToast();


  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);

      //Store user data in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Fetch cart immediately after login
      try {
        await axios.get(`http://localhost:5000/api/cart/${response.data.user._id}`);
      } catch (error) {
        showToast(error);
      }

      login(response.data.user);
      showToast("Login successful!", "success");
      // Redirect based on role
      navigate(response.data.user.role === "admin" ? "/admin" : "/");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed. Please try again.", "error");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6">Login</h1>
        <form className='text-xl space-y-5' onSubmit={handleSubmit}>
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
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-4 rounded-full hover:bg-pink-600"
          >
            Sign in
          </button>
        </form>
         <div className="mt-4 text-center">
          <p className='text-xl'>
            <Link to="/forgot-password" className="text-blue-500">
              Forgot Password?
            </Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className='text-xl'>
            Don't have an account?{' '}
            <Link to="/admin" className="text-blue-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
