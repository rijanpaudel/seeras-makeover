import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { useToast } from "../Context/ToastContext";

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity, cartItems } = location.state || {}; // Get product & quantity from Buy Now button
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("khalti"); // Default to Khalti
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.fullName || !formData.address || !formData.phoneNumber) {
      setError("Please provide all the required fields");
      setLoading(false);
      return;
    }

    let totalAmount = 0;

    try {
      let items = [];

      if (product) {
        items = [{ productId: product._id, quantity }];
        totalAmount = product.price * quantity;
      } else if (cartItems && cartItems.length > 0) {
        items = cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        }));
        totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      } else {
        showToast("No items to place an order");
        setLoading(false);
        return;
      }

      const orderData = {
        userId: user._id,
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        items: items,
        paymentMethod: paymentMethod
      };

      console.log("Order Data:", orderData);
      console.log("Total Amount:", totalAmount);
      
      // For Cash on Delivery, directly place the order without payment gateway
      if (paymentMethod === "cod") {
        const orderRes = await axios.post(
          `${BASE_URL}/api/orders/place-cod`,
          orderData
        );
        
        if (orderRes.data.success) {
          showToast("Order placed successfully!");
          navigate("/"); // Redirect to home
        } else {
          throw new Error("Failed to place order");
        }
      } 
      // For Khalti payment
      else {
        const amountInPaisa = Math.round(totalAmount * 100);
        console.log("Amount in Paisa:", amountInPaisa);

        const paymentInitData = {
          amount: amountInPaisa,
          purchase_order_id: `ORD-${Date.now()}`,
          purchase_order_name: product ? product.title : "Cart Checkout",
          return_url: "http://localhost:5173/payment/verify",
          customer_info: {
            name: formData.fullName,
            email: user.email,
            phone: formData.phoneNumber,
          },
          extra: {
            orderData,
          },
          paymentMethod: paymentMethod
        };

        console.log("Payment Init Request:", paymentInitData);

        const paymentInitRes = await axios.post(
          `${BASE_URL}/api/orders/place`,
          paymentInitData
        );

        console.log("Payment Init Response:", paymentInitRes.data);

        if (paymentInitRes.data.payment_url) {
          window.location.href = paymentInitRes.data.payment_url;
        } else {
          throw new Error("Failed to initiate payment: No payment URL returned");
        }
      }
    } catch (error) {
      console.error("Order error details:", error);
      setError(error.message || "Failed to process your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { }, [user, product]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Show Buy Now product */}
      {product && (
        <div className="border p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold">{product.title}</h3>
          <p>Price: Rs {product.price}</p>
          <p>Quantity: {quantity}</p>
          <p className="font-semibold mt-2">Total: Rs {product.price * quantity}</p>
        </div>
      )}

      {/* Show Cart Items */}
      {!product && cartItems && cartItems.length > 0 && (
        <div className="border p-4 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Cart Items</h3>
          {cartItems.map((item) => (
            <div key={item.product._id} className="mb-4 border-b pb-2">
              <h4 className="text-lg">{item.product.title}</h4>
              <p>Price: Rs {item.product.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Subtotal: Rs {item.product.price * item.quantity}</p>
            </div>
          ))}
          <p className="font-semibold mt-2">
            Total: Rs {cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
          </p>
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

        {/* Payment Method Selection */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="khalti"
                name="paymentMethod"
                value="khalti"
                checked={paymentMethod === "khalti"}
                onChange={handlePaymentMethodChange}
                className="mr-2"
              />
              <label htmlFor="khalti" className="flex items-center">
                <span className="mr-2">Khalti</span>
                <span className="text-purple-600 font-semibold">(Online Payment)</span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={handlePaymentMethodChange}
                className="mr-2"
              />
              <label htmlFor="cod" className="flex items-center">
                <span className="mr-2">Cash on Delivery</span>
                <span className="text-green-600 font-semibold">(Pay when you receive)</span>
              </label>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button 
          type="submit" 
          className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600"
        >
          {loading ? "Processing..." : paymentMethod === "khalti" ? "Pay with Khalti" : "Place Order (COD)"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;