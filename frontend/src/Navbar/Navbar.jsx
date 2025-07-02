import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from "../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user?._id) return;
      try {
        const response = await axios.get(`${BASE_URL}/api/cart/${user._id}`);
        setCartCount(response.data.items.length);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, [user]);

  const isActive = (path) => location.pathname === path ? "text-pink-500" : "text-gray-800";

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast("Logout successful!");
  };

  return (
    <nav className="w-full bg-white fixed z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24 lg:h-28">
          {/* Logo */}
          <div className="flex-shrink-0 w-24 sm:w-28 md:w-32 h-auto flex items-center">
            <img src={logo} alt="Logo" className="w-full h-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
            <Link to="/" className={`${isActive("/")} hover:text-pink-700 text-base xl:text-lg font-medium transition-colors duration-200`}>Home</Link>
            <Link to="/services" className={`${isActive("/services")} hover:text-pink-500 text-base xl:text-lg font-medium transition-colors duration-200`}>Services</Link>
            <Link to="/appointment" className={`${isActive("/bookappointment")} hover:text-pink-500 text-base xl:text-lg font-medium transition-colors duration-200`}>Book Appointment</Link>
            <Link to="/aboutus" className={`${isActive("/aboutus")} hover:text-pink-500 text-base xl:text-lg font-medium transition-colors duration-200`}>About us</Link>
            <Link to="/products" className={`${isActive("/products")} hover:text-pink-500 text-base xl:text-lg font-medium transition-colors duration-200`}>Products</Link>
            <Link to="/enroll" className={`${isActive("/enroll")} hover:text-pink-500 text-base xl:text-lg font-medium transition-colors duration-200`}>Enroll Now</Link>
          </div>

          {/* Cart & Account Section */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {user && (
              <>
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-gray-800 text-2xl md:text-3xl hover:text-pink-500 transition-colors duration-200" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/myAccount" className="text-gray-800 hover:text-pink-500 transition-colors duration-200">
                  <FaUserCircle className="text-2xl md:text-3xl" />
                </Link>
              </>
            )}

            {/* Auth Buttons */}
            {user ? (
              <button 
                onClick={handleLogout} 
                className="hover:text-pink-500 text-sm md:text-base lg:text-base xl:text-lg font-medium transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <div className="hidden lg:flex items-center space-x-6">
                <Link to="/login" className="hover:text-pink-500 text-base xl:text-lg font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register">
                  <button className="bg-pink-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-full hover:bg-pink-600 transition-all duration-200 text-base xl:text-lg">
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-gray-800 hover:text-pink-500 focus:outline-none p-2"
                aria-label="Toggle menu"
              >
                <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all duration-200 ${isOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current mb-1.5 ${isOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all duration-200 ${isOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        >
          <div className="flex flex-col space-y-4 py-4">
            <Link to="/" className="text-gray-800 hover:text-pink-500 text-base font-medium px-2 py-1">Home</Link>
            <Link to="/services" className="text-gray-800 hover:text-pink-500 text-base font-medium px-2 py-1">Services</Link>
            <Link to="/bookappointment" className="text-gray-800 hover:text-pink-500 text-base font-medium px-2 py-1">Book Appointment</Link>
            <Link to="/aboutus" className="text-gray-800 hover:text-pink-500 text-base font-medium px-2 py-1">About us</Link>
            <Link to="/products" className="text-gray-800 hover:text-pink-500 text-base font-medium px-2 py-1">Products</Link>
            <Link to="/enroll" className="text-gray-800 hover:text-pink-500 text-base font-medium px-2 py-1">Enroll Now</Link>
            
            {!user && (
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <Link to="/login" className="block text-gray-800 hover:text-pink-500 text-base font-medium px-2 py-1">
                  Login
                </Link>
                <Link to="/register" className="block">
                  <button className="w-full bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors text-base">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;