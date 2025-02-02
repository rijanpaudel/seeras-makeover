import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import AppointmentManagement from './AppointmentManagement';
import CustomerManagement from './CustomerManagement';
import CourseManagement from "./CourseManagement"


const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-200`}>
        <div className="p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="/appointments" element={<AppointmentManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/courses" element={<CourseManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;