import React, { useState } from "react";
import { Calendar, Edit2, X, Plus } from "lucide-react";

const AppointmentManagement = () => {
  const [appointments] = useState([
    { id: 1, customer: 'John Doe', service: 'Bridal Makeup', date: '2024-03-15', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, customer: 'Jane Smith', service: 'Hair Styling', date: '2024-03-16', time: '2:30 PM', status: 'Pending' },
    { id: 3, customer: 'Alice Johnson', service: 'Gel Nails', date: '2024-03-16', time: '4:00 PM', status: 'Cancelled' },
    { id: 4, customer: 'Emily Davis', service: 'Hair Coloring', date: '2024-03-17', time: '11:30 AM', status: 'Confirmed' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Management</h1>
              <p className="text-gray-600">Manage and track all your salon appointments</p>
            </div>
            <button className="flex items-center bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium">
              <Plus className="w-5 h-5 mr-2" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.customer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{appointment.service}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {appointment.date} at {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                          appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center text-gray-600 hover:text-pink-500 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-pink-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;