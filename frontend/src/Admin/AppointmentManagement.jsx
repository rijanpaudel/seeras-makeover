import React, { useState, useEffect } from "react";
import { Calendar, Edit2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentManagement = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments/all");
      setAppointments(response.data);
    } catch (error) {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/appointments/status/${appointmentId}`, { status: newStatus });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const editAppointment = (appointment) => {
    setEditData(appointment);
    setEditModal(true);
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/delete/${appointmentId}`);
      fetchAppointments();
    } catch (error) {
      console.error("Failed to delete appointment", error);
    }
  };

  const submitEdit = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/appointments/update/${editData._id}`, editData);
      fetchAppointments();
      setEditModal(false);
    } catch (error) {
      console.error("Failed to update appointment", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
  <div className="flex justify-between items-center flex-wrap gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Management</h1>
      <p className="text-gray-600">Manage and track all your salon appointments</p>
    </div>
    <button
      onClick={() => navigate("/admin/blockedslots")}
      className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors"
    >
      Manage Blocked Slots
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
                  <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.userId.fullName}</div>
                      <div className="text-sm text-gray-500">{appointment.userId.email}</div>
                      <div className="text-sm text-gray-500">{appointment.userId.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{appointment.subServiceId.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at {new Date(appointment.appointmentTime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateStatus(appointment._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => editAppointment(appointment)} className="flex items-center text-gray-600 hover:text-pink-500 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {editModal && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                              <h2 className="text-lg font-bold mb-4">Edit Appointment</h2>
                              <label>Date:</label>
                              <input
                                type="date"
                                value={editData.appointmentDate}
                                onChange={(e) => setEditData({ ...editData, appointmentDate: e.target.value })}
                                className="border px-2 py-1 w-full mb-2"
                              />
                              <label>Time:</label>
                              <input
                                type="time"
                                value={editData.appointmentTime}
                                onChange={(e) => setEditData({ ...editData, appointmentTime: e.target.value })}
                                className="border px-2 py-1 w-full mb-2"
                              />
                              <button onClick={submitEdit} className="bg-pink-500 text-white px-4 py-2 rounded">Save</button>
                            </div>
                          </div>
                        )}
                        <button onClick={() => deleteAppointment(appointment._id)} className="flex items-center text-gray-600 hover:text-pink-500 transition-colors">
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
