import React, { useState, useEffect } from "react";
import { Calendar, Edit2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentManagement = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- for edit modal ----
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/appointments/all");
      setAppointments(data);
      setError(null);
    } catch {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/update/${id}`,
        { status: newStatus }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const openEdit = (appt) => {
    const dt = new Date(appt.appointmentDateTime);
    setEditId(appt._id);
    setEditDate(dt.toISOString().slice(0,10));        // YYYY-MM-DD
    setEditTime(dt.toISOString().slice(11,16));       // HH:MM
    setEditModal(true);
  };

  const submitEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/update/${editId}`,
        { 
          appointmentDate: editDate, 
          appointmentTime: `${editTime} ${( +editTime.slice(0,2) >= 12 ? 'PM' : 'AM' )}`
        }
      );
      setEditModal(false);
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update appointment", err);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/delete/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error("Failed to delete appointment", err);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (error)   return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Appointment Management</h1>
            <p className="text-gray-600">Track and edit all appointments</p>
          </div>
          <button
            onClick={() => navigate("/admin/blockedslots")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full"
          >Manage Blocked Slots</button>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Service</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date &amp; Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appt) => {
                const dt = new Date(appt.appointmentDateTime);
                return (
                  <tr key={appt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{appt.userId.fullName}</div>
                      <div className="text-gray-500 text-sm">{appt.userId.email}</div>
                    </td>
                    <td className="px-6 py-4">{appt.subServiceId.name}</td>
                    <td className="px-6 py-4 flex items-center text-sm text-gray-700">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {dt.toLocaleDateString()} at {dt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={appt.status}
                        onChange={(e) => updateStatus(appt._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 space-x-3 flex">
                      <button onClick={() => openEdit(appt)} className="text-gray-600 hover:text-pink-500">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteAppointment(appt._id)} className="text-gray-600 hover:text-red-500">
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Appointment</h2>
            <label className="block mb-2">Date</label>
            <input
              type="date"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <label className="block mb-2">Time</label>
            <input
              type="time"
              value={editTime}
              onChange={e => setEditTime(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >Cancel</button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
              >Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
