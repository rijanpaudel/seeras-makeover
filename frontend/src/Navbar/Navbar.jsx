import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCart } from "../Context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();  // Get cart data
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fix: Prevent crash if cart is null or undefined
  const cartCount = cart?.items?.length ?? 0; 

  const isActive = (path) => location.pathname === path ? "text-pink-500" : "text-gray-800";

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-white fixed z-50">
      <div className="mx-auto px-6">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <div className="flex-shrink-0 w-32 h-12 flex items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-16">
            <Link to="/" className={`${isActive("/")} hover:text-pink-700 text-2xl font-medium`}>Home</Link>
            <Link to="/services" className={`${isActive("/services")} hover:text-pink-500 text-2xl font-medium`}>Services</Link>
            <Link to="/bookappointment" className={`${isActive("/bookappointment")} hover:text-pink-500 text-2xl font-medium`}>Book Appointment</Link>
            <Link to="/aboutus" className={`${isActive("/aboutus")} hover:text-pink-500 text-2xl font-medium`}>About us</Link>
            <Link to="/products" className={`${isActive("/products")} hover:text-pink-500 text-2xl font-medium`}>Products</Link>
            <Link to="/enroll" className={`${isActive("/enroll")} hover:text-pink-500 text-2xl font-medium`}>Enroll Now</Link>
          </div>

          {/* Cart & Account Section */}
          {user && (
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="text-gray-800 hover:text-pink-500 text-xl font-medium">
                Cart ({cartCount}) 
              </Link>
              <Link to="/myAccount" className="text-gray-800 hover:text-pink-500 text-xl font-medium">
                My Account
              </Link>
            </div>
          )}

          {/* Auth Buttons */}
          {user ? (
            <button onClick={handleLogout} className="hover:text-pink-500 text-xl font-medium">
              Logout
            </button>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/login" className="hover:text-pink-500 text-xl font-medium">Login</Link>
              <Link to="/register">
                <button className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors text-xl">
                  Sign up
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 hover:text-pink-500 focus:outline-none p-3">
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
              <Link to="/" className="text-pink-500 hover:text-pink-700 text-xl font-medium">Home</Link>
              <Link to="/services" className="text-gray-800 hover:text-pink-500 text-xl font-medium">Services</Link>
              <Link to="/bookappointment" className="text-gray-800 hover:text-pink-500 text-xl font-medium">Book Appointment</Link>
              <Link to="/aboutus" className="text-gray-800 hover:text-pink-500 text-xl font-medium">About us</Link>
              <Link to="/products" className="text-gray-800 hover:text-pink-500 text-xl font-medium">Products</Link>
              <Link to="/enroll" className="text-gray-800 hover:text-pink-500 text-xl font-medium">Enroll Now</Link>
              <div className="pt-6 border-t border-gray-200">
                <Link to="/login" className="block text-gray-800 hover:text-pink-500 text-xl font-medium mb-6">Login</Link>
                <Link to="/signup">
                  <button className="w-full bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors text-xl">
                    Sign up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
