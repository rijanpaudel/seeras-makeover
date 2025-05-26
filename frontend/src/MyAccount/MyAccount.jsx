import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Context/ToastContext';
import axios from 'axios';

function MyAccount() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (user && user._id) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || ''
      });
      fetchPurchases();
      fetchAppointments();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/orders/purchases/${user._id}`);
      setPurchases(response.data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Failed to fetch purchase history');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/appointmentHistory/${user._id}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Create request payload excluding the email field
      const updatePayload = {
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phoneNumber
      };

      const response = await axios.put(`http://localhost:5000/api/auth/${user._id}`, updatePayload);
      if (response.status === 200) {
        showToast('Profile updated successfully');
        login(response.data);
        setIsEditing(false);
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          address: response.data.address || '',
          phoneNumber: response.data.phoneNumber || ''
        });
      }
    } catch (err) {
      setError('Failed to update profile');
      showToast('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format dates safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Invalid date';
    }
  };

  const renderProfile = () => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Personal Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-pink-500 border-2 border-pink-500 rounded-full hover:bg-pink-50 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={true}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors disabled:bg-pink-300"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="text-black font-medium">{formData.fullName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="text-black font-medium">{formData.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Address</p>
            <p className="text-black font-medium">{formData.address || 'No address added'}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="text-black font-medium">{formData.phoneNumber || 'No phone added'}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPurchases = () => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Purchase History</h3>
      {loading ? (
        <div className="text-center py-4">Loading purchases...</div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-4 text-gray-600">No purchase history available</div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">Order #{purchase._id ? purchase._id.slice(-6) : 'N/A'}</p>
                  <p className="text-gray-600">{formatDate(purchase.createdAt)}</p>
                  <p className="text-gray-600">Status: {purchase.status}</p>
                </div>
                <p className="text-pink-500 font-semibold">Rs {purchase.totalAmount}</p>
              </div>
              <div className="space-y-2">
                {purchase.items && purchase.items.map((item, index) => (
                  <div key={item._id || index} className="flex justify-between items-center">
                    <p className="text-gray-800">
                      {item.product && item.product.title ? item.product.title : 'Product'} × {item.quantity}
                    </p>
                    <p className="text-gray-600">
                      Rs {item.product && item.product.price ? item.product.price * item.quantity : 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Appointment History</h3>
      {loading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-4 text-gray-600">No appointment history available</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">Appointment #{appointment._id ? appointment._id.slice(-6) : 'N/A'}</p>
                  <p className="text-gray-600">{formatDate(appointment.appointmentDateTime)}</p>
                </div>
                <p className="text-black-500 font-semibold">
                  {appointment.subServiceId && appointment.subServiceId.name
                    ? `Service: ${appointment.subServiceId.name}`
                    : 'Service details not available'}
                </p>
              </div>
              <p className="text-gray-800">Status: {appointment.status || 'Processing'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-56">
      <h1 className="text-4xl font-bold mb-8">My Account</h1>

      <div className="mb-8">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium ${activeTab === 'profile'
              ? 'text-pink-500 border-b-2 border-pink-500'
              : 'text-gray-600 hover:text-pink-500'
              }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-6 py-3 font-medium ${activeTab === 'purchases'
              ? 'text-pink-500 border-b-2 border-pink-500'
              : 'text-gray-600 hover:text-pink-500'
              }`}
          >
            Purchases
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-medium ${activeTab === 'appointments'
              ? 'text-pink-500 border-b-2 border-pink-500'
              : 'text-gray-600 hover:text-pink-500'
              }`}
          >
            Appointments
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}
      {activeTab === 'profile' ? renderProfile() : activeTab === 'purchases' ? renderPurchases() : renderAppointments()}
    </div>
  );
}

export default MyAccount;