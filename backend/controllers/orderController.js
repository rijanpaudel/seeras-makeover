import Order from "../models/Order.js";
import mongoose from "mongoose";

// Place an order
export const placeOrder = async (req, res) => {
  const { userId, items, fullName, address, phoneNumber } = req.body;

  // Validate that all required fields are provided
  if (!userId || !fullName || !address || !phoneNumber || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Missing required fields. Please check the data." });
  }

  //Ensure each item has a valid product and quantity
  for (let item of items) {
    if (!item.productId || !item.quantity) {
      return res.status(400).json({ message: "Each item must have a valid product and quantity." });
    }
  }

  try {

    console.log("Order data received:", req.body);


    const newOrder = new Order({
      userId,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity
      })),
      deliveryDetails: { fullName, address, phoneNumber },
      status: "Pending",
    });

    await newOrder.save();
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
