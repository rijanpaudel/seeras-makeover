import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Sidebar from "./Sidebar";
import AppointmentManagement from "./AppointmentManagement";
import CustomerManagement from "./CustomerManagement";
import CourseManagement from "./CourseManagement";
import AdminProducts from "./AdminProducts";
import { AuthProvider } from "../Context/AuthContext";
import ServiceManagement from "./ServiceManagement";

const PrivateAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "admin" ? children : <Navigate to="/" />;
};

export default function AdminApp() {
  return (
    <AuthProvider>
      <div className="admin-container flex">
        
        {/* ✅ Sidebar stays fixed */}
        <Sidebar />  

        {/* ✅ Content area with left margin so it doesn't overlap */}
        <div className="admin-content flex-grow p-8 ml-64">
          <Routes>
            <Route path="/" element={<PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>} />
            <Route path="/appointments" element={<PrivateAdminRoute><AppointmentManagement /></PrivateAdminRoute>} />
            <Route path="/customers" element={<PrivateAdminRoute><CustomerManagement /></PrivateAdminRoute>} />
            <Route path="/courses" element={<PrivateAdminRoute><CourseManagement /></PrivateAdminRoute>} />
            <Route path="/services" element={<PrivateAdminRoute><ServiceManagement /></PrivateAdminRoute>} />
            <Route path="/adminProducts" element={<PrivateAdminRoute><AdminProducts /></PrivateAdminRoute>} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
