import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext"; // Import useCart
import axios from "axios";

const CartPage = () => {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart(); // Use cart from CartContext
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      if (user?._id) {
        try {
          console.log("Fetching cart for user:", user._id); // Debugging
          await fetchCart(); // Fetch cart using context's fetchCart
          console.log("Cart data:", cart); // Check cart contents
          setLoading(false);
        } catch (error) {
          console.error("Error fetching cart:", error.response?.data || error.message);
          setError("Failed to load cart items");
          setLoading(false);
        }
      }
    };
    loadCart();
  }, [user, fetchCart]);

  if (loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  console.log("Final Cart Data in UI:", cart);

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="text-center text-gray-600 py-8">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item._id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{item.product?.title ?? "No Title"}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-800">Price: Rs {item.product?.price ?? "0"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartPage;
