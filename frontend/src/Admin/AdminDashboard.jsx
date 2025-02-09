import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import AppointmentManagement from './AppointmentManagement';
import CustomerManagement from './CustomerManagement';
import CourseManagement from "./CourseManagement"


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user || user.role !== "admin"){
      navigate("/")
    }
    else{
      setLoading(false);
    }
  }, [navigate])
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