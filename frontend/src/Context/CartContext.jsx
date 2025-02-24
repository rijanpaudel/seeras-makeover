import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    if (user?._id) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user?._id) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      console.log("Cart fetched from API:", response.data);
      
      // Ensure the cart is always an object with items array
      setCart(response.data || { items: [] });
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
      setCart({ items: [] }); // Prevent cart from being undefined
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user?._id) {
      alert("You must be logged in to add to cart");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId,
        quantity,
      });

      if (response.status === 200) {
        console.log("Updated Cart after Add:", response.data.cart);
        setCart(response.data.cart || { items: [] });
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
