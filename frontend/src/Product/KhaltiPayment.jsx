import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../Context/ToastContext"; // Assuming you have this

const KhaltiPayment = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("Verifying your payment...");
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = params.get("pidx");
      
      if (!pidx) {
        setStatus("Invalid payment information");
        showToast("Payment verification failed: Missing payment ID");
        return;
      }

      try {
        setStatus("Verifying payment with Khalti...");
        const res = await axios.post("http://localhost:5000/api/payment/verify", { pidx });
        if (res.data.status === "Completed") {
          setStatus("Payment successful! Your order has been placed.");
          showToast("Payment successful! Your order has been placed.");
        } else {
          setStatus(`Payment not successful: ${res.data.status || "Unknown error"}`);
          showToast(`Payment failed: ${res.data.status || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("Payment verification failed");
        showToast("Payment verification failed. Please contact support.");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-6">Payment Processing</h2>
      <p className="text-lg">{status}</p>
      <div className="mt-8">
        <button 
          onClick={() => navigate("/")}
          className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600 mr-4"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default KhaltiPayment;