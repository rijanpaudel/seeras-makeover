import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingBag, Edit2, Trash2, Package, User, Phone, MapPin } from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/orders/all");
      console.log("Orders response:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/update/${orderId}`, { status });
      await fetchOrders(); // Refresh orders after update
    } catch (error) {
      setError("Failed to update order status.");
      console.error(error.response?.data || error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/delete/${orderId}`);
        await fetchOrders();
      } catch (error) {
        setError("Error deleting order.");
      }
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Order Management</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={20} className="text-pink-500" />
                    <h3 className="text-xl font-semibold">Order ID: {order._id}</h3> {/* Display Order ID */}
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={18} />
                      <span>{order.userId.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package size={18} />
                      <span>Products:</span>
                    </div>
                  </div>

                  {/* Loop through products in the order */}
                  <div className="space-y-2 mt-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-semibold">{item.product.title}</span>
                        <span>Quantity: {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button to expand order details */}
                  <button
                    onClick={() => toggleOrderDetails(order._id)}
                    className="text-pink-500 font-medium hover:text-pink-600 transition-colors"
                  >
                    {expandedOrder === order._id ? "Hide Details" : "View Details"}
                  </button>

                  {/* Expanded details of the order */}
                  {expandedOrder === order._id && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin size={18} className="text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium text-gray-700">Delivery Address</p>
                          <p className="text-gray-600">{order.deliveryDetails.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={18} className="text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-700">Contact Number</p>
                          <p className="text-gray-600">{order.deliveryDetails.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Status */}
                <div className="flex flex-col gap-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>

                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            No orders available.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;