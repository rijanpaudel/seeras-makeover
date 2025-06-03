import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !user._id) {
        console.log("No user logged in. Cannot fetch cart.");
        setError("You must be logged in to view your cart.");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching cart for user: ${user._id}`);
        const response = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
        console.log("Cart Data:", response.data);

        if (!response.data.items || response.data.items.length === 0) {
          console.log("Cart is empty.");
        }

        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error.response?.data || error.message);
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is available (avoids fetching on first load before auth is restored)
    if (user) {
      fetchCart();
    }
  }, [user]); // Dependency on user


  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);

    try {
      // This assumes you have an API endpoint to update quantity
      // If not, you'll need to create one or modify the add endpoint to handle updates
      await axios.post(`http://localhost:5000/api/cart/add`, {
        userId: user._id,
        productId,
        quantity: 1 // Add one more
      });

      // Update the local state
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.map(item =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleBuyNow = () => {
    if (cart && cart.items.length > 0) {
      // Send all cart items to the checkout page
      navigate("/checkout", { state: { cartItems: cart.items } });
    } else {
      alert("Your cart is empty!");
    }
  }

  const handleRemoveItem = async (productId) => {
    setUpdating(true);
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${user._id}/${productId}`);

      // Update the local cart state
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.filter(item => item.product._id !== productId)
      }));
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Cart</h2>
          <p className="text-red-600">{error}</p>
          <Link to="/login" className="mt-4 inline-block bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  console.log("Cart state before rendering:", cart);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total price
  const totalPrice = cart.items.reduce((total, item) =>
    total + ((item.product?.price || 0) * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>

      {updating && (
        <div className="fixed top-4 right-4 bg-pink-100 text-pink-800 px-4 py-2 rounded-md shadow-md z-50">
          Updating cart...
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="hidden md:grid md:grid-cols-5 bg-gray-50 p-4 border-b text-gray-600 font-medium">
          <div className="col-span-2">Product</div>
          <div className="text-center">Price</div>
          <div className="text-center">Quantity</div>
          <div className="text-right">Subtotal</div>
        </div>

        <div className="divide-y">
          {cart.items.map((item) => (
            <div key={item._id} className="p-4 md:grid md:grid-cols-5 md:gap-4 items-center">
              <div className="col-span-2 flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                  {item.product?.image ? (
                    <img
                      src={`http://localhost:5000${item.product.image}`}
                      alt={item.product?.title || "Product"}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center">No Image</div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.product?.title || "No Title"}
                  </h3>
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="text-red-500 hover:text-red-700 text-sm mt-1 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-gray-800 md:text-center mb-4 md:mb-0">
                <span className="md:hidden text-gray-500 mr-2">Price:</span>
                Rs {item.product?.price || "N/A"}
              </div>

              <div className="md:text-center mb-4 md:mb-0">
                <span className="md:hidden text-gray-500 mr-2">Quantity:</span>
                <div className="inline-flex items-center border rounded-md">
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 border-r hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                    className="px-3 py-1 border-l hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-gray-800 font-semibold md:text-right">
                <span className="md:hidden text-gray-500 mr-2">Subtotal:</span>
                Rs {(item.product?.price || 0) * item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:w-1/2 md:ml-auto">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b">Order Summary</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">Rs {totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">Rs 0</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">Rs {totalPrice}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleBuyNow}
            className="block w-full bg-pink-500 hover:bg-pink-600 text-white text-center font-semibold py-3 rounded-lg transition-colors"
          >
            Proceed to Checkout
          </button>
          <Link
            to="/products"
            className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-center font-medium py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;