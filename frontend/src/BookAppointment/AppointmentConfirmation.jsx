import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from '../Context/ToastContext';
import axios from "axios";

const AppointmentConfirmation = () => {
  const location = useLocation();
  console.log("Location State:", location.state);
  const navigate = useNavigate();
  const { subServiceId } = useParams();
  const { userId, appointmentDate, appointmentTime } = location.state || {};
  const { showToast } = useToast();

  const [subService, setSubService] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have all required data
    if (!location.state || !userId || !appointmentDate || !appointmentTime) {
      console.log("Missing required appointment data");
      navigate('/');
      return;
    }

    const fetchSubServiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sub-services/service/${subServiceId}`);
        setSubService(response.data);
      } catch (error) {
        console.error("Error fetching subservice details:", error);
      }
    };
    if (subServiceId) {
      fetchSubServiceDetails();
    }
  }, [subServiceId, location.state, userId, appointmentDate, appointmentTime]);

  if (!subService || !appointmentDate || !appointmentTime) {
    return <div>Loading appointment details...</div>;
  }

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/appointments/book", {
        userId,
        subServiceId,
        appointmentDate,
        appointmentTime,
        notes,
      });
      console.log("Appointment Confirmed: ", response.data);
      showToast("Appointment confirmed successfully!");
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
    finally{
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-44">
      <h1 className="text-4xl font-bold text-center">Confirm Your Appointment</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="my-8">
        <h2 className="text-2xl">Appointment Details</h2>
        <p><strong>Service:</strong> {subService?.name || "Loading..."}</p>
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
        disabled={isSubmitting}
        className={`bg-pink-500 text-white px-8 py-3 rounded-full text-xl font-medium w-full hover:bg-pink-600 ${
          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "Processing..." : "Confirm Appointment"}
      </button>
    </div>
  );
};

export default AppointmentConfirmation;