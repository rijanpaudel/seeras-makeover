import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (user?._id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
          setCart(response.data);
        } catch (error) {
          console.error("Error fetching cart:", error);
          setError("Failed to load cart items");
        } finally {
          setLoading(false);
        }
      }
    };

      fetchCart();
  }, [user]);

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if(error) {
    return <div>Error: {error}</div>;
  }

  if(!cart?.items?.length) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item._id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold">{item.product.title}</h3>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
            <p className="text-gray-800">Price: Rs {item.product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CartPage;
