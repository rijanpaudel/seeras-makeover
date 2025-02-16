// CartPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/cart/${user._id}`);
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user]);

  if (!cart) {
    return <div>Loading cart...</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.items.map((item) => (
          <div key={item._id}>
            <h3>{item.productId.title}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: Rs {item.productId.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CartPage;
