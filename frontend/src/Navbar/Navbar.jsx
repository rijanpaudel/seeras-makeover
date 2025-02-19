import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useCart } from "../Context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user and logout from AuthContext
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.length;

  // Check if the current link is active
  const isActive = (path) => location.pathname === path ? "text-pink-500" : "text-gray-800";

  // Handle logout and redirect to homepage
  const handleLogout = () => {
    logout(); // Logout and clear user data
    navigate('/'); // Redirect to homepage
  };

  // Ensure Navbar is updated on login or logout
  useEffect(() => {
    if (user) {
      // If user is logged in, set the navbar as logged in
      setIsOpen(false);  // Close mobile menu if it's open
    }
  }, [user]);

  return (
    <nav className="w-full bg-white fixed z-50">
      <div className="mx-auto px-6">
        <div className="flex justify-between items-center h-32">
          {/* Logo Area */}
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

          {user ? (
            <>
          <div className="cart">
            <Link to="/cart">
              Cart ({cartCount})
            </Link>
          </div>
          </>
          ) : (
            <div></div>
          )
        }

          {user ? (
            <>
          <div className="myAccount">
            <Link to="/myAccount">
              My Account
            </Link>
          </div>
          </>
          ) : (
            <div></div>
          )
        }

          {/* Auth Buttons */}
          {user ? (
            <>
              <button onClick={handleLogout} className={`${isActive("/login")} hover:text-pink-500 text-xl font-medium`}>
                Logout
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/login" className={`${isActive("/login")} hover:text-pink-500 text-xl font-medium`}>Login</Link>
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
