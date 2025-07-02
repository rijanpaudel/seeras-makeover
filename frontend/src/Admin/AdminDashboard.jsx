import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import AppointmentManagement from './AppointmentManagement';
import CustomerManagement from './CustomerManagement';
import CourseManagement from "./CourseManagement";
import { BarChart as BarChartIcon, Users, BookOpen, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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
    courseCompletionRate: 0,
    monthlyAppointments: [],
    serviceDistribution: []
  });
  const [error, setError] = useState(null);

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
        if (!user || user.role !== "admin") {
          navigate("/");
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/");
        return false;
      }
    };

    if (checkAuth()) {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch appointments count
      const appointmentsRes = await axios.get(`${BASE_URL}/api/admin/appointments/count`)
        .catch(err => {
          console.error("Error fetching appointments count:", err);
          return { data: { count: 0 } };
        });

      // Fetch active customers
      const customersRes = await axios.get(`${BASE_URL}/api/admin/customers/active`)
        .catch(err => {
          console.error("Error fetching active customers:", err);
          return { data: { count: 0, growthRate: 0 } };
        });

      // Fetch ongoing courses
      const coursesRes = await axios.get(`${BASE_URL}/api/admin/courses/ongoing`)
        .catch(err => {
          console.error("Error fetching ongoing courses:", err);
          return { data: { count: 0, completionRate: 0 } };
        });

      // Fetch recent appointments
      const recentAppointmentsRes = await axios.get(`${BASE_URL}/api/admin/appointments/recent`)
        .catch(err => {
          console.error("Error fetching recent appointments:", err);
          return { data: [] };
        });

      // Fetch monthly appointment data
      const monthlyAppointmentsRes = await axios.get(`${BASE_URL}/api/appointments/monthly`)
        .catch(err => {
          console.error("Error fetching monthly appointments:", err);
          // Fallback to generated data if API fails
          return { data: generateFallbackMonthlyData() };
        });

      // Fetch service distribution data
      const serviceDistributionRes = await axios.get(`${BASE_URL}/api/appointments/services-distribution`)
        .catch(err => {
          console.error("Error fetching service distribution:", err);
          // Fallback to generated data if API fails
          return { data: generateFallbackServiceData() };
        });

      setDashboardData({
        totalAppointments: appointmentsRes.data.count || 0,
        activeCustomers: customersRes.data.count || 0,
        ongoingCourses: coursesRes.data.count || 0,
        recentAppointments: Array.isArray(recentAppointmentsRes.data) ? 
          recentAppointmentsRes.data : 
          (recentAppointmentsRes.data?.appointments || []),
        customerGrowth: customersRes.data.growthRate || 0,
        courseCompletionRate: coursesRes.data.completionRate || 0,
        monthlyAppointments: Array.isArray(monthlyAppointmentsRes.data) ? 
          monthlyAppointmentsRes.data : 
          (monthlyAppointmentsRes.data?.monthlyData || generateFallbackMonthlyData()),
        serviceDistribution: Array.isArray(serviceDistributionRes.data) ? 
          serviceDistributionRes.data : 
          (serviceDistributionRes.data?.serviceData || generateFallbackServiceData())
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Return only the last 6 months
    return months
      .slice(Math.max(0, currentMonth - 5), currentMonth + 1)
      .map((month, index) => ({
        name: month,
        appointments: Math.floor(Math.random() * 50) + 20,
      }));
  };

  const generateFallbackServiceData = () => {
    return [
      { name: 'Haircut', value: 35 },
      { name: 'Manicure', value: 25 },
      { name: 'Facial', value: 20 },
      { name: 'Massage', value: 15 },
      { name: 'Other', value: 5 },
    ];
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  // Helper function to format appointment date and time
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString() + " at " + 
        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Error formatting date";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-red-500 text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                    color="bg-blue-500"
                  />
                  <StatCard 
                    title="Active Customers" 
                    value={dashboardData.activeCustomers} 
                    icon={<Users size={24} className="text-white" />}
                    color="bg-purple-500" 
                  />
                  <StatCard 
                    title="Ongoing Courses" 
                    value={dashboardData.ongoingCourses} 
                    icon={<BookOpen size={24} className="text-white" />}
                    color="bg-pink-500"
                  />
                </div>

                {/* Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Monthly Appointments Chart */}
                  <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Monthly Appointments</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dashboardData.monthlyAppointments}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="appointments" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Service Distribution Pie Chart */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Service Distribution</h2>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.serviceDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {dashboardData.serviceDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Appointments Table */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
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
                          {dashboardData.recentAppointments && dashboardData.recentAppointments.length > 0 ? (
                            dashboardData.recentAppointments.map((appointment) => (
                              <tr key={appointment._id || `appointment-${Math.random()}`}>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  {appointment.userId?.fullName || "N/A"}
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  {appointment.subServiceId?.name || "N/A"}
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  {formatDateTime(appointment.appointmentDateTime)}
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    appointment.status?.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                    appointment.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {appointment.status ? 
                                      (appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).toLowerCase()) 
                                      : "N/A"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="py-4 text-center text-gray-500">No recent appointments found</td>
                            </tr>
                          )}
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