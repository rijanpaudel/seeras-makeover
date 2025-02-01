import React from "react";
import { useState } from "react";

const AppointmentManagement = () => {
  const [appointments] = useState([
    { id: 1, customer: 'John Doe', service: 'Bridal Makeup', date: '2024-03-15', status: 'Confirmed' },
    { id: 2, customer: 'Jane Smith', service: 'Hair Styling', date: '2024-03-16', status: 'Pending' }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">+ New Appointment</button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Service</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td className="px-6 py-4">{appointment.customer}</td>
                <td className="px-6 py-4">{appointment.service}</td>
                <td className="px-6 py-4">{appointment.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentManagement;