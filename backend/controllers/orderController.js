import Order from "../models/Order.js";
import mongoose from "mongoose";

// Place an order
export const placeOrder = async (req, res) => {
  const { userId, productId, quantity, fullName, address, phoneNumber } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid user or product ID format" });
  }

  try {
    const newOrder = new Order({
      userId,
      product: productId,
      quantity,
      deliveryDetails: { fullName, address, phoneNumber },
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
    const orders = await Order.find().populate("userId", "email").populate("product");
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
