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
import UserCourseProgress from "./UserCourseProgress";
import CustomerDetails from "./CustomerDetails";
import OrderManagement from "./OrderManagement";
import AdminBlockedSlots from "./AdminBlockedSlots";
import CustomerAppointments from "./CustomerAppointments";
import CustomerEnrollments from "./CustomerEnrollments";
import CustomerOrders from "./CustomerOrders";

const PrivateAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "admin" ? children : <Navigate to="/" />;
};

export default function AdminApp() {
  return (
    <AuthProvider>
      <div className="admin-container flex">

        <Sidebar />

        <div className="admin-content flex-grow p-8 ml-64">
          <Routes>
            <Route path="/" element={<PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>} />
            <Route path="/appointments" element={<PrivateAdminRoute><AppointmentManagement /></PrivateAdminRoute>} />
            <Route path="/customers" element={<PrivateAdminRoute><CustomerManagement /></PrivateAdminRoute>} />
            <Route path="/courses" element={<PrivateAdminRoute><CourseManagement /></PrivateAdminRoute>} />
            <Route path="/services" element={<PrivateAdminRoute><ServiceManagement /></PrivateAdminRoute>} />
            <Route path="/adminProducts" element={<PrivateAdminRoute><AdminProducts /></PrivateAdminRoute>} />
            <Route path="/customer/:userId" element={<PrivateAdminRoute><CustomerDetails /></PrivateAdminRoute>} />
            <Route path="/course-progress/:enrollmentId" element={<PrivateAdminRoute><UserCourseProgress editable={true} /></PrivateAdminRoute>} />
            <Route path="/orders" element={<PrivateAdminRoute><OrderManagement /></PrivateAdminRoute>} />
            <Route path="/blockedslots" element={<PrivateAdminRoute><AdminBlockedSlots /></PrivateAdminRoute>} />
            <Route path="/customer/:userId/appointments" element={<PrivateAdminRoute><CustomerAppointments /></PrivateAdminRoute>}/>
            <Route path="/customer/:userId/enrollments" element={<PrivateAdminRoute><CustomerEnrollments /></PrivateAdminRoute>}/>
            <Route path="/customer/:userId/orders" element={<PrivateAdminRoute><CustomerOrders /></PrivateAdminRoute>}/>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
