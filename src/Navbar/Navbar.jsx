import React, { useState } from 'react';
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white fixed z-50">
      <div className="mx-auto px-6">
        <div className="flex justify-between items-center h-32">
          {/* Logo Area */}
          <div className="flex-shrink-0 w-32 h-12 flex items-center justify-center">
            <img src={logo} alt="" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-16">
            <Link to="/" className="text-pink-500 hover:text-pink-700 text-2xl font-medium">
              Home
            </Link>
            <a href="/services" className="text-gray-800 hover:text-pink-500 text-2xl font-medium">
              Services
            </a>
            <Link to="/bookappointment" className="text-gray-800 hover:text-pink-500 text-2xl font-medium">
              Book Appointment
            </Link>
            <a href="/about" className="text-gray-800 hover:text-pink-500 text-2xl font-medium">
              About us
            </a>
            <Link to="/products" className="text-gray-800 hover:text-pink-500 text-2xl font-medium">
              Products
            </Link>
            <a href="/enroll" className="text-gray-800 hover:text-pink-500 text-2xl font-medium">
              Enroll Now
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-gray-800 hover:text-pink-500 text-xl font-medium">
              Login
            </Link>
            <Link to="/register">
              <button className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors text-xl">
                Sign up
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-pink-500 focus:outline-none p-3"
            >
              <div className="w-8 h-1 bg-current mb-2"></div>
              <div className="w-8 h-1 bg-current mb-2"></div>
              <div className="w-8 h-1 bg-current"></div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6">
            <div className="flex flex-col space-y-6">
              <a href="/" className="text-pink-500 hover:text-pink-700 text-xl font-medium">
                Home
              </a>
              <a href="/services" className="text-gray-800 hover:text-pink-500 text-xl font-medium">
                Services
              </a>
              <a href="/book" className="text-gray-800 hover:text-pink-500 text-xl font-medium">
                Book Appointment
              </a>
              <a href="/about" className="text-gray-800 hover:text-pink-500 text-xl font-medium">
                About us
              </a>
              <a href="/products" className="text-gray-800 hover:text-pink-500 text-xl font-medium">
                Products
              </a>
              <a href="/enroll" className="text-gray-800 hover:text-pink-500 text-xl font-medium">
                Enroll Now
              </a>
              <div className="pt-6 border-t border-gray-200">
                <a href="/login" className="block text-gray-800 hover:text-pink-500 text-xl font-medium mb-6">
                  Login
                </a>
                <a href="/signup">
                  <button className="w-full bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors text-xl">
                    Sign up
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;