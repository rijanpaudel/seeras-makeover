import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import AppointmentManagement from './AppointmentManagement';
import CustomerManagement from './CustomerManagement';
import CourseManagement from "./CourseManagement";
import { BarChart, PieChart, Users, BookOpen, Calendar, TrendingUp, ArrowUpRight } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalAppointments: 0,
    activeCustomers: 0,
    ongoingCourses: 0,
    recentAppointments: [],
    customerGrowth: 0,
    courseCompletionRate: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, customersRes, coursesRes, recentAppointmentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/appointments/count'),
        axios.get('http://localhost:5000/api/admin/customers/active'),
        axios.get('http://localhost:5000/api/admin/courses/ongoing'),
        axios.get('http://localhost:5000/api/admin/appointments/recent')
      ]);

      setDashboardData({
        totalAppointments: appointmentsRes.data.count || 0,
        activeCustomers: customersRes.data.count || 0,
        ongoingCourses: coursesRes.data.count || 0,
        recentAppointments: recentAppointmentsRes.data.appointments || [],
        customerGrowth: customersRes.data.growthRate || 0,
        courseCompletionRate: coursesRes.data.completionRate || 0
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend !== null && (
          <div className="flex items-center text-green-500 text-sm font-medium">
            <ArrowUpRight size={16} className="mr-1" />
            <span>{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-200 p-8`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, Admin</p>
          </div>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            onClick={fetchDashboardData}
          >
            Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <Routes>
            <Route index element={
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <StatCard 
                    title="Total Appointments" 
                    value={dashboardData.totalAppointments} 
                    icon={<Calendar size={24} className="text-white" />} 
                    trend={8.2} 
                    color="bg-blue-500"
                  />
                  <StatCard 
                    title="Active Customers" 
                    value={dashboardData.activeCustomers} 
                    icon={<Users size={24} className="text-white" />} 
                    trend={dashboardData.customerGrowth}
                    color="bg-purple-500" 
                  />
                  <StatCard 
                    title="Ongoing Courses" 
                    value={dashboardData.ongoingCourses} 
                    icon={<BookOpen size={24} className="text-white" />} 
                    trend={5.3} 
                    color="bg-pink-500"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {dashboardData.recentAppointments.map((appointment) => (
                            <tr key={appointment._id}>
                              <td className="py-3 px-4 whitespace-nowrap">{appointment.userId.fullName}</td>
                              <td className="py-3 px-4 whitespace-nowrap">{appointment.service}</td>
                              <td className="py-3 px-4 whitespace-nowrap">{appointment.date} at {appointment.time}</td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                  appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            } />
            <Route path="/appointments" element={<AppointmentManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/courses" element={<CourseManagement />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
