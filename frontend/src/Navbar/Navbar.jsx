import React, { useState } from 'react';
import logo from "../assets/logo.png"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); //Get the current route
  const navigate = useState();

  //Function to check if a link is active
  const isActive = (path) => location.pathname === path ? "text-pink-500" : "text-gray-800";

  const handleLogout = () => {
    logout();
    navigate('/');
  }
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
            <Link to="/" className={`${isActive("/")} hover:text-pink-700 text-2xl font-medium`}>
              Home
            </Link>
            <Link to="/services" className={`${isActive("/services")} hover:text-pink-500 text-2xl font-medium`}>
              Services
            </Link>
            <Link to="/bookappointment" className={`${isActive("/bookappointment")} hover:text-pink-500 text-2xl font-medium`}>
              Book Appointment
            </Link>
            <Link to="/aboutus" className={`${isActive("/aboutus")} hover:text-pink-500 text-2xl font-medium`}>
              About us
            </Link>
            <Link to="/products" className={`${isActive("/products")} hover:text-pink-500 text-2xl font-medium`}>
              Products
            </Link>
            <Link to="/enroll" className={`${isActive("/enroll")} hover:text-pink-500 text-2xl font-medium`}>
              Enroll Now
            </Link>
          </div>

          {/* Auth Buttons */}
          {user ? (
            <>
              <button onClick = {logout} className={`${isActive("/login")} hover:text-pink-500 text-xl font-medium`}>
                Logout
                </button>
            </>
          ) : (
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className={`${isActive("/login")} hover:text-pink-500 text-xl font-medium`}>
              Login
            </Link>
            <Link to="/register">
              <button className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors text-xl">
                Sign up
              </button>
            </Link>
          </div>
          )}
          
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