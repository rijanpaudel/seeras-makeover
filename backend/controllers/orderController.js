import axios from "axios";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js"; // Assuming you have a User model to get email

// Place an order
export const placeOrder = async (req, res) => {

  // Check if the order data is nested in req.body.extra.orderData
  const orderData = req.body.extra && req.body.extra.orderData ? req.body.extra.orderData : req.body;

  const { userId, items, fullName, address, phoneNumber } = req.body;

  // Validate that all required fields are provided
  if (!userId || !fullName || !address || !phoneNumber || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Missing required fields. Please check the data." });
  }

  // Ensure each item has a valid product and quantity
  for (let item of items) {
    if (!item.productId || !item.quantity) {
      return res.status(400).json({ message: "Each item must have a valid product and quantity." });
    }
  }

  try {
    // Fetch the product details for each item (Ensure products are returned correctly with name and price)
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ '_id': { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(404).json({ message: "One or more products not found." });
    }

    // Calculate total amount and generate order items with product details
    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId.toString());
      totalAmount += product.price * item.quantity;
      return {
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Fetch the user email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const orderData = {
      userId,
      fullName,
      address,
      phoneNumber,
      items,
    };

    const paymentRequestData = {
      amount: totalAmount,
      purchase_order_id: `ORD-${Date.now()}`,
      purchase_order_name: `Order-${Date.now()}`,
      customer_info: {
        fullName,
        email: user.email,
        phone: phoneNumber,
      },
      return_url: "http://localhost:5173/payment/verify",
      extra: {
        orderData,
      }
    };

    console.log("Initiating payment with data:", paymentInitData);

    // Call your payment initiation endpoint
    const paymentResponse = await axios.post("http://localhost:5000/api/payment/initiate", paymentInitData);
    if (paymentResponse.data.payment_url) {
      return res.status(200).json({
        message: "Payment initiated",
        payment_url: paymentResponse.data.payment_url,
      });
    } else {
      return res.status(400).json({ message: "Payment initiation failed." });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Error placing order", error });
  }
};


// Get all orders for Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "email").populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fetch the user's email
    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the email content
    const emailHTML = `
      <html>
        <body>
          <h2>Order Status Update</h2>
          <p>Dear Customer,</p>
          <p>Your order (Order ID: ${order._id}) status has been updated to: <strong>${status}</strong>.</p>
          <p>We will notify you once there are any further updates.</p>
          <p>Regards,<br/>Seeras Makeover</p>
        </body>
      </html>
    `;

    // Send email notification to the user
    await sendEmail(
      user.email,
      `Order Status Update - Seeras Makeover`,
      `Your order status has been updated to ${status}`,
      emailHTML
    );

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error });
  }
};

// Delete Order (Admin Only)
export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order", error });
  }
};


export const getPurchaseDetails = async (req, res) => {
  try {
    const purchases = await Order.find({ userId: req.params.userId }).populate("items.product");
    res.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases", error)
    res.status(500).json({ message: "Error fetching purchases" });
  }
};