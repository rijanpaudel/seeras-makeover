import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 bg-white shadow-lg w-64 transform ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } transition duration-200 ease-in-out z-50`}>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">Dashboard</Link>
          <Link to="/admin/appointments" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">Appointments</Link>
          <Link to="/admin/customers" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">Customers</Link>
          <Link to="/admin/courses" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">Course Management</Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;