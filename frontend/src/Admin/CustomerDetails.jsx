import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Calendar, BookOpen, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";

const CustomerDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
        setCustomer(response.data)
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setError("Failed to load customer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [userId]);

  const handleNavigation = (path) => {
    navigate(path);
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
          onClick={() => navigate("/admin/customers")}
          className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Customer List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate("/admin/customers")} 
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Customer List
        </button>

        {/* Customer Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Details</h1>
          
          {customer ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 p-4 rounded-full">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{customer.fullName}</h2>
                    <p className="text-gray-500">Customer ID: {customer._id}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="min-w-[100px] font-medium text-gray-500">Email:</div>
                    <div className="text-gray-800">{customer.email}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="min-w-[100px] font-medium text-gray-500">Phone:</div>
                    <div className="text-gray-800">{customer.phoneNumber || "Not provided"}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="min-w-[100px] font-medium text-gray-500">Address:</div>
                    <div className="text-gray-800">{customer.address || "Not provided"}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="min-w-[100px] font-medium text-gray-500">Joined:</div>
                    <div className="text-gray-800">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:border-l md:pl-8 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Activities</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Options for different customer data */}
                  <button
                    onClick={() => handleNavigation(`/admin/customer/${userId}/appointments`)}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-pink-300 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-3 bg-pink-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-800">Appointments</h3>
                        <p className="text-sm text-gray-500">View customer's appointment history</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation(`/admin/customer/${userId}/enrollments`)}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-800">Enrollments</h3>
                        <p className="text-sm text-gray-500">View customer's course enrollments</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation(`/admin/customer/${userId}/orders`)}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <ShoppingBag className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-800">Orders</h3>
                        <p className="text-sm text-gray-500">View customer's order history</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Customer information not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;