import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Loader2, Check, Clock, X } from "lucide-react";

const CustomerAppointments = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch customer details
        const customerResponse = await axios.get(`${BASE_URL}/api/auth/user/${userId}`);
        setCustomer(customerResponse.data);
        
        // Fetch appointments
        const appointmentsResponse = await axios.get(`${BASE_URL}/api/appointments/appointmentHistory/${userId}`);
        setAppointments(appointmentsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={() => navigate(`/admin/customer/${userId}`)}
          className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Customer Details
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate(`/admin/customer/${userId}`)} 
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Customer Details
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-pink-100 rounded-lg">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              {customer && <p className="text-gray-600">Appointments for {customer.fullName}</p>}
            </div>
          </div>

          {appointments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">No appointments found for this customer.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {appointment.subServiceId?.name || "N/A"}
                        </div>
                        {appointment.serviceId?.name && (
                          <div className="text-sm text-gray-500">
                            {appointment.serviceId.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDateTime(appointment.appointmentDateTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(appointment.status)}
                          <span className={`ml-1.5 inline-block px-2 py-1 text-xs rounded-full ${
                            appointment.status?.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            appointment.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status ? 
                              (appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).toLowerCase()) 
                              : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.provider?.name || "Not assigned"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAppointments;