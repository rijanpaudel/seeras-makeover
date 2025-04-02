import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity, cartItems } = location.state || {}; // Get product & quantity from Buy Now button

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Ensure all required fields are populated
    if (!formData.fullName || !formData.address || !formData.phoneNumber) {
      setError("Please provide all the required fields");
      setLoading(false);
      return;
    }

    try {
      let orderData = {
        userId: user._id, // Ensure this is the correct user ID from auth context
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        items: [],
      };

      if (product) {
        // For single product purchase
        orderData.items.push({ productId: product._id, quantity });
      } else if (cartItems.length > 0) {
        // For cart checkout (multiple products)
        orderData.items = cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        }));
      } else {
        alert("No items to place an order");
        setLoading(false);
        return;
      }

      console.log("Order Data Sent to Backend:", orderData);

      const response = await axios.post("http://localhost:5000/api/orders/place", orderData);

      if (response.status === 201) {
        alert("Order placed successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Order error:", error);
      setError(error.response ? error.response.data.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [user, product]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Show Buy Now product */}
      {product && (
        <div className="border p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold">{product.title}</h3>
          <p>Price: Rs {product.price}</p>
          <p>Quantity: {quantity}</p>
        </div>
      )}

      {/* Show Cart Items */}
      {!product && cartItems.length > 0 && (
        <div className="border p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Cart Items</h3>
          {cartItems.map((item) => (
            <div key={item.product._id} className="mb-4 border-b pb-2">
              <h4 className="text-lg">{item.product.title}</h4>
              <p>Price: Rs {item.product.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600">
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
