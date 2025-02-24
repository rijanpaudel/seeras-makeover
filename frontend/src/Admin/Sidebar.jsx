import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // Get current page
  const navigate = useNavigate(); // For redirection after logout

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed inset-y-0 left-0 flex flex-col">
      <h2 className="text-2xl font-bold text-white p-4">Admin Panel</h2>
      <nav className="flex-grow p-4 space-y-2">
        <Link 
          to="/admin"
          className={`block p-2 rounded ${
            location.pathname === "/admin" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          Dashboard
        </Link>
        <Link 
          to="/admin/appointments"
          className={`block p-2 rounded ${
            location.pathname === "/admin/appointments" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          Appointments
        </Link>
        <Link 
          to="/admin/customers"
          className={`block p-2 rounded ${
            location.pathname === "/admin/customers" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          Customers
        </Link>
        <Link 
          to="/admin/adminProducts"
          className={`block p-2 rounded ${
            location.pathname === "/admin/adminProducts" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          Products
        </Link>
        <Link 
          to="/admin/orders"
          className={`block p-2 rounded ${
            location.pathname === "/admin/orders" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          Orders
        </Link>
        <Link 
          to="/admin/services"
          className={`block p-2 rounded ${
            location.pathname === "/admin/services" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          Services
        </Link>
        <Link 
          to="/admin/courses"
          className={`block p-2 rounded ${
            location.pathname === "/admin/courses" ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          Course Management
        </Link>
      </nav>

      {/* ✅ Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full p-3 bg-red-500 hover:bg-red-600 text-white font-bold text-center mt-auto"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
