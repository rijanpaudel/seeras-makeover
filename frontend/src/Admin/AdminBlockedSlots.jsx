import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminBlockedSlots = () => {
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch existing blocked slots
  const fetchSlots = async () => {
    try {
      const response = await axios.get(`/api/blocked-slots`);
      setSlots(response.data);
    } catch (err) {
      setError("Error fetching blocked slots");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/blocked-slots/create`, formData);
      setFormData({ date: "", startTime: "", endTime: "" });
      fetchSlots();
    } catch (err) {
      setError("Error adding blocked slot");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/blocked-slots/delete/${id}`);
      fetchSlots();
    } catch (err) {
      setError("Error deleting blocked slot");
    }
  };

  const handleBack = () => {
    navigate("/appointment"); // Or wherever you want to go back to
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Blocked Appointment Slots</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Form to add a blocked slot */}
      <form onSubmit={handleAddSlot} className="mb-8 border p-4 rounded-lg">
        <div className="mb-4">
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Adding..." : "Add Blocked Slot"}
        </button>
      </form>
      
      {/* List of existing blocked slots */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Blocked Slots</h2>
        {slots.length > 0 ? (
          <ul>
            {slots.map((slot) => (
              <li key={slot._id} className="flex justify-between items-center border p-2 mb-2 rounded">
                <span>
                  {new Date(slot.date).toLocaleDateString()} | {slot.startTime} - {slot.endTime}
                </span>
                <button onClick={() => handleDelete(slot._id)} className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No blocked slots available.</p>
        )}
      </div>
      
      {/* Back button at the bottom center */}
      <div className="w-full flex justify-center mt-8 mb-6">
        <button 
          onClick={handleBack}
          className="px-12 py-3 text-lg font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600 focus:outline-none"
          aria-label="Go back"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AdminBlockedSlots;
