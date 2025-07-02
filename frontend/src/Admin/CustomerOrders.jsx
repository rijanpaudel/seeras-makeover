import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";

const CustomerOrders = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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

        // Fetch orders
        const ordersResponse = await axios.get(`${BASE_URL}/api/orders/purchases/${userId}`);
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format currency function
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);
  };

  const computeOrderTotal = (order) =>
    (order.items || []).reduce(
      (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
      0
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
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
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
              {customer && <p className="text-gray-600">Orders for {customer.fullName}</p>}
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">No orders found for this customer.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order ID</p>
                        <p className="text-gray-800 font-medium">{order._id}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="text-gray-800">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${order.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status?.toLowerCase() === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {order.status ?
                            (order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase())
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Items</h4>
                    {order.items && order.items.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                          <li key={item._id} className="py-2 flex justify-between">
                            <span>{item.product?.title || 'Unknown product'}</span>
                            <span>x {item.quantity}</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NPR' }).format(item.product?.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No items found in this order.</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">Total</span>
                      </div>
                      <span className="font-bold text-xl text-gray-800">
                      {formatCurrency(computeOrderTotal(order))}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;