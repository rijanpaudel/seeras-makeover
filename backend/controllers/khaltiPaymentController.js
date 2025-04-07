import dotenv from "dotenv";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import sendEmail from "../utils/emailService.js";

dotenv.config();

// Khalti API configuration
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_API_URL = "https://a.khalti.com/api/v2";

// 1. INITIATE PAYMENT
export const initiatePayment = async (req, res) => {
  const { amount, purchase_order_id, purchase_order_name, return_url, customer_info, extra } = req.body;

  const payload = {
    return_url,
    website_url: "http://localhost:3000", 
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

    const data = await response.json();

    if (response.ok) {
      res.json({
        payment_url: data.payment_url,
        pidx: data.pidx,
        orderData: extra.orderData, // Pass this along to maintain order information
      });
    } else {
      res.status(400).json({ message: data.message || "Failed to initiate payment" });
    }
  } catch (err) {
    console.error("Error initiating Khalti payment:", err);
    res.status(500).json({ message: "Error initiating Khalti payment" });
  }
};

// 2. VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  const { pidx, orderData } = req.body;

  try {
    const response = await fetch(`${KHALTI_API_URL}/epayment/lookup/`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await response.json();

    if (data.status === "Completed") {
      // Payment is verified, now place the order

      const { userId, fullName, address, phoneNumber, items } = orderData;

      // Get products for the items
      const productIds = items.map(item => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });

      if (products.length !== items.length) {
        return res.status(404).json({ message: "Some products not found" });
      }

      // Calculate total amount and build order items
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

      // Create and save the new order
      const newOrder = new Order({
        userId,
        items: orderItems.map(i => ({ product: i.product, quantity: i.quantity })),
        deliveryDetails: { fullName, address, phoneNumber },
        status: "Pending",
      });

      await newOrder.save();

      const user = await User.findById(userId);

      let emailHTML = `
        <h2>Order Confirmed</h2>
        <ul>
          ${orderItems.map(i => `<li>${i.name} - Qty: ${i.quantity} - Rs ${i.price}</li>`).join("")}
        </ul>
        <p>Total: Rs ${totalAmount}</p>
        <p>Thank you for your order!</p>
      `;

      await sendEmail(
        user.email,
        "Seeras Makeover - Order Confirmed",
        "Your order has been placed successfully",
        emailHTML
      );

      res.status(200).json({ message: "Payment verified and order placed!", order: newOrder });
    } else {
      res.status(400).json({ message: "Payment not completed", status: data.status });
    }
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
