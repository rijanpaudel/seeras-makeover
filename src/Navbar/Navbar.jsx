import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <nav className="bg-white shadow-sm w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex-shrink-0">
          <img
            src={logo}
            alt="Seeras Makover Logo"
            className="w-36"
          />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <ul className="flex space-x-4 md:space-x-6 lg:space-x-8 text-gray-800 font-medium text-base sm:text-lg md:text-xl">
              <li><a href="/" className="hover:text-pink-600 transition-colors">Home</a></li>
              <li className="relative group">
                <button className="hover:text-pink-600 transition-colors flex items-center">
                  Services
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </li>
              <li><a href="/appointment" className="hover:text-pink-600 transition-colors">Book Appointment</a></li>
              <li><a href="/about" className="hover:text-pink-600 transition-colors">About us</a></li>
              <li className="relative group">
                <button className="hover:text-pink-600 transition-colors flex items-center">
                  Products
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </li>
              <li><a href="/enroll" className="hover:text-pink-600 transition-colors">Enroll Now</a></li>
            </ul>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a href="/login" className="text-base sm:text-lg text-pink-600 hover:text-pink-800 transition-colors">
              Login
            </a>
            <a href="/register" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full text-base sm:text-lg transition-colors">
              Sign up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-pink-600 focus:outline-none transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white shadow-lg">
          <ul className="space-y-3 text-gray-800">
            <li><a href="/" className="block px-3 py-2 text-lg hover:text-pink-600 transition-colors">Home</a></li>
            <li><button className="block w-full text-left px-3 py-2 text-lg hover:text-pink-600 transition-colors">Services</button></li>
            <li><a href="/appointment" className="block px-3 py-2 text-lg hover:text-pink-600 transition-colors">Book Appointment</a></li>
            <li><a href="/about" className="block px-3 py-2 text-lg hover:text-pink-600 transition-colors">About us</a></li>
            <li><button className="block w-full text-left px-3 py-2 text-lg hover:text-pink-600 transition-colors">Products</button></li>
            <li><a href="/enroll" className="block px-3 py-2 text-lg hover:text-pink-600 transition-colors">Enroll Now</a></li>
          </ul>
          <div className="pt-4 space-y-3">
            <a href="/login" className="block w-full text-center px-4 py-2 text-lg text-pink-600 hover:text-pink-800 transition-colors">
              Login
            </a>
            <a href="/register" className="block w-full text-center px-4 py-2 text-lg bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full transition-colors">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;