import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6">Register</h1>
        <form className='text-xl space-y-5'>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full p-4 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Address"
              className="w-full p-4 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirm Password"
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
            <Link to="/" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
