import { React, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const KhaltiPayment = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const pidx = params.get("pidx");
      if (!pidx) return;

      try {
        const res = await axios.post("http://localhost:5000/api/payment/verify", { pidx });

        if (res.data.status === "Completed") {
          // Grant access (e.g., enroll course)
          console.log("Payment successful:", res.data);
        } else {
          console.warn("Payment not successful:", res.data.status);
        }
      } catch (error) {
        console.error("Verification failed:", error);
      }
    };

    verifyPayment();
  }, [params]);

  return <div>Verifying your payment...</div>;
};

export default KhaltiPayment;
