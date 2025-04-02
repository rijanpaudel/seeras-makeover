import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sendEmail from "../utils/emailService.js";
import mongoose from "mongoose";
import User from "../models/User.js"; // Assuming you have a User model to get email

// Place an order
export const placeOrder = async (req, res) => {
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
    console.log("Order data received:", req.body);

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
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      totalAmount += product.price * item.quantity; // Add price calculation
      return {
        product: product._id,
        name: product.name,   // Ensure you include the name here
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Create the new order document
    const newOrder = new Order({
      userId,
      items: orderItems.map(item => ({
        product: item.product,
        quantity: item.quantity
      })),
      deliveryDetails: { fullName, address, phoneNumber },
      status: "Pending",
    });

    // Save the order to the database
    await newOrder.save();

    // Fetch the user email
    const user = await User.findById(userId); // Assuming you have a User model
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prepare Order Email Content
    let productListHTML = orderItems.map(
      (item) => `<li>${item.name} - Quantity: ${item.quantity} - Price: $${item.price}</li>`
    ).join("");

    const emailHTML = `
      <html>
        <body>
          <h2>Order Confirmation</h2>
          <p>Dear Customer,</p>
          <p>Thank you for your order! Your order has been successfully placed.</p>
          <h3>Order Details:</h3>
          <ul>${productListHTML}</ul>
          <p><strong>Total Amount: $${totalAmount}</strong></p>
          <p>We will notify you once your order is shipped.</p>
          <p>Regards,<br/>Seeras Makeover</p>
        </body>
      </html>
    `;

    // Send confirmation email to the user
    await sendEmail(
      user.email,
      "Order Confirmation - Seeras Makeover",
      "Your order has been placed successfully!",
      emailHTML
    );

    // Respond to the client with order details
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order", error });
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
