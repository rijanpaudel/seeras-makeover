import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity } = location.state || {}; // Get product & quantity from Buy Now button

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!product) {
    return <div className="text-center py-8 text-red-500">Error: No product selected.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/orders/place", {
        userId: user._id,
        productId: product._id,
        quantity,
        ...formData,
      });

      if (response.status === 201) {
        alert("Order placed successfully!");
        navigate("/"); // Redirect to home page after success
      }
    } catch (error) {
      setError("Failed to place order. Try again.");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="border p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold">{product.title}</h3>
        <p>Price: Rs {product.price}</p>
        <p>Quantity: {quantity}</p>
      </div>

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
