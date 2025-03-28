import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, subServiceId, appointmentDate, appointmentTime } = location.state || {};
  
  const [subService, setSubService] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchSubServiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sub-services/${subServiceId}`);
        setSubService(response.data); 
      } catch (error) {
        console.error("Error fetching subservice details:", error);
      }
    };
    if (subServiceId) {
      fetchSubServiceDetails();
    }
  }, [subServiceId]);

  if (!subService) {
    return <div>Loading...</div>;
  }

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/appointments/book", {
        userId,
        subServiceId,
        appointmentDate,
        appointmentTime,
        notes,
      });
      console.log("Appointment Confirmed: ", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-44">
      <h1 className="text-4xl font-bold text-center">Confirm Your Appointment</h1>
      <div className="my-8">
        <h2 className="text-2xl">Appointment Details</h2>
        <p><strong>Service:</strong> {subService.name}</p>
        <p><strong>Date:</strong> {appointmentDate}</p>
        <p><strong>Time:</strong> {appointmentTime}</p>
      </div>

      <div className="my-8">
        <h2 className="text-2xl">Add Notes</h2>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add any special requests or notes here..."
          className="w-full p-4 border rounded-md"
        />
      </div>

      <button
        onClick={handleConfirm}
        className="bg-pink-500 text-white px-8 py-3 rounded-full text-xl font-medium w-full hover:bg-pink-600"
      >
        Confirm Appointment
      </button>
    </div>
  );
};

export default AppointmentConfirmation;
