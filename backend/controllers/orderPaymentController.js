import dotenv from "dotenv";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import sendEmail from "../utils/emailService.js";
import Payment from "../models/Payment.js";

dotenv.config();

// Khalti API configuration
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_API_URL = "https://a.khalti.com/api/v2";

// 1. INITIATE PAYMENT
export const initiatePayment = async (req, res) => {
  const { amount, purchase_order_id, purchase_order_name, return_url, customer_info, extra } = req.body;

  if (!amount || !purchase_order_id || !purchase_order_name || !return_url || !customer_info) {
    return res.status(400).json({ message: "Missing required payment fields" });
  }

  if (!KHALTI_SECRET_KEY) {
    console.error("KHALTI_SECRET_KEY is not defined in environment variables");
    return res.status(500).json({ message: "Payment configuration error" });
  }

  const payload = {
    return_url,
    website_url: "http://localhost:5173",
    amount,
    purchase_order_id,
    purchase_order_name,
    customer_info,
  };

  try {
    const response = await fetch(`${KHALTI_API_URL}/epayment/initiate/`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawResponse = await response.text();
    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error("Failed to parse Khalti response:", parseError);
      return res.status(500).json({ message: "Invalid response from payment gateway" });
    }

    if (response.ok) {
      // Only store the payment record
      await Payment.create({
        pidx: data.pidx,
        orderData: extra.orderData,
        status: 'Pending',
        processed: false,  // Mark as not processed yet
      });

      return res.json({
        payment_url: data.payment_url,
        pidx: data.pidx,
      });
    } else {
      console.error("Khalti API error:", data);
      return res.status(response.status).json({
        message: data.detail || data.message || "Payment gateway error",
        details: data,
      });
    }
  } catch (err) {
    console.error("Error initiating Khalti payment:", err);
    return res.status(500).json({ message: "Error connecting to payment gateway" });
  }
};


// 2. VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) {
    return res.status(400).json({ message: "Missing pidx" });
  }

  try {
    // Find the payment record
    const paymentRecord = await Payment.findOne({ pidx });

    if (!paymentRecord) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    // If already processed, return the existing linked order
    if (paymentRecord.processed && paymentRecord.orderId) {
      const existingOrder = await Order.findById(paymentRecord.orderId);
      return res.status(200).json({
        message: "Payment already processed",
        order: existingOrder,
        status: "Completed",
      });
    }

    // Check with Khalti API for payment status
    const response = await fetch(`${KHALTI_API_URL}/epayment/lookup/`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await response.json();
    console.log("Khalti verification response:", data);

    // If payment is not completed, reject
    if (data.status !== "Completed") {
      return res.status(400).json({ message: "Payment not completed", status: data.status });
    }

    // Check again if order with this pidx already exists (race condition prevention)
    let existingOrder = await Order.findOne({ pidx });
    if (existingOrder) {
      // Update payment record accordingly
      paymentRecord.processed = true;
      paymentRecord.orderId = existingOrder._id;
      paymentRecord.status = "Completed";
      await paymentRecord.save();

      return res.status(200).json({
        message: "Payment verified and order already exists",
        status: "Completed",
        order: existingOrder,
      });
    }

    // Step 6: Create new order
    const orderData = paymentRecord.orderData;
    if (!orderData) {
      return res.status(400).json({ message: "Order data not found in payment record" });
    }

    const { userId, fullName, address, phoneNumber, items } = orderData;

    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    let totalAmount = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      totalAmount += product.price * item.quantity;
      return {
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    let newOrder;
    try {
      newOrder = await Order.create({
        userId,
        items: orderItems.map(i => ({ product: i.product, quantity: i.quantity })),
        deliveryDetails: { fullName, address, phoneNumber },
        status: "Pending",
        paymentMethod: orderData.paymentMethod || "khalti",
        paymentStatus: "Completed",
        pidx,
      });
    } catch (err) {
      // If duplicate error due to pidx, handle gracefully
      if (err.code === 11000 && err.keyPattern?.pidx) {
        existingOrder = await Order.findOne({ pidx });
        paymentRecord.processed = true;
        paymentRecord.orderId = existingOrder._id;
        paymentRecord.status = "Completed";
        await paymentRecord.save();
        return res.status(200).json({
          message: "Payment verified and order already exists",
          status: "Completed",
          order: existingOrder,
        });
      } else {
        throw err;
      }
    }

    // Step 7: Send email confirmation
    const user = await User.findById(userId);
    if (user) {
      const emailHTML = `
        <h2>Order Confirmed</h2>
        <ul>
          ${orderItems.map(i => `<li>${i.name} - Qty: ${i.quantity} - Rs ${i.price}</li>`).join("")}
        </ul>
        <p>Total: Rs ${totalAmount}</p>
        <p>Thank you for your order!</p>
      `;
      try {
        await sendEmail(
          user.email,
          "Seeras Makeover - Order Confirmed",
          "Your order has been placed successfully",
          emailHTML
        );
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    // Step 8: Mark payment as completed and link to new order
    paymentRecord.processed = true;
    paymentRecord.orderId = newOrder._id;
    paymentRecord.status = "Completed";
    await paymentRecord.save();

    return res.status(200).json({
      message: "Payment verified and order placed!",
      status: "Completed",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    return res.status(500).json({ message: "Error verifying payment" });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
