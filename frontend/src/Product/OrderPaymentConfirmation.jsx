import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../Context/ToastContext";

const OrderPaymentConfirmation = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("Verifying your payment...");
  const [isComplete, setIsComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = params.get("pidx");
      
      if (!pidx) {
        setStatus("Invalid payment information");
        showToast("Payment verification failed: Missing payment ID", "error");
        return;
      }
      
      try {
        setStatus("Verifying payment with Khalti...");
        
        // Add a delay to ensure the backend has time to process
        setTimeout(async () => {
          try {
            const res = await axios.post("http://localhost:5000/api/payment/verify", { pidx });
            console.log("Payment verification response:", res.data);
            
            if (res.data.status === "Completed") {
              setStatus("Payment successful! Your order has been placed.");
              setOrderDetails(res.data.order);
              setIsComplete(true);
              showToast("Payment successful! Your order has been placed.", "success");
            } else {
              setStatus(`Payment not successful: ${res.data.status || "Unknown error"}`);
              showToast(`Payment failed: ${res.data.status || "Unknown error"}`, "error");
            }
          } catch (error) {
            console.error("Verification failed:", error.response?.data || error);
            setStatus("Payment verification failed");
            showToast("Payment verification failed. Please contact support.", "error");
          }
        }, 1000); // Small delay to ensure backend processing is complete
        
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("Payment verification failed");
        showToast("Payment verification failed. Please contact support.", "error");
      }
    };
    
    verifyPayment();
  }, [params, showToast]);
  
  const handleNavigateHome = () => {
    navigate("/");
  };
  
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-6">Payment Processing</h2>
      
      <div className="border p-4 rounded-lg mb-6">
        <p className="text-lg my-4">{status}</p>
        
        {isComplete && orderDetails && (
          <div className="mt-4 p-4 bg-green-50 rounded">
            <p className="text-green-600 font-bold">Order #: {orderDetails._id}</p>
            <p className="text-green-600 mb-4">Status: {orderDetails.status}</p>
            
            <div className="mt-2">
              <p className="font-semibold">Delivery Details:</p>
              <p>{orderDetails.deliveryDetails.fullName}</p>
              <p>{orderDetails.deliveryDetails.address}</p>
              <p>{orderDetails.deliveryDetails.phoneNumber}</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <button
            onClick={handleNavigateHome}
            className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600 mr-4"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentConfirmation;