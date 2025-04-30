import axios from "axios";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import sendEmail from "../utils/emailService.js";
import Cart from "../models/Cart.js";

// Place an order with online payment
export const placeOrder = async (req, res) => {
  // Extract the orderData from the request
  const {
    amount,
    purchase_order_id,
    purchase_order_name,
    return_url,
    customer_info,
    extra,
  } = req.body;

  if (!extra || !extra.orderData) {
    return res.status(400).json({ message: "Missing order data" });
  }

  const orderData = extra.orderData;
  const { userId, items, fullName, address, phoneNumber, paymentMethod } =
    orderData;

  // Validate required fields
  if (
    !userId ||
    !fullName ||
    !address ||
    !phoneNumber ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields. Please check the data." });
  }

  try {
    // Fetch product details
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res
        .status(404)
        .json({ message: "One or more products not found." });
    }

    // Create the payment initiation data
    const paymentInitData = {
      amount,
      purchase_order_id,
      purchase_order_name,
      return_url,
      customer_info,
      extra: {
        orderData: {
          ...orderData,
          paymentMethod: paymentMethod || "Khalti", // Ensure payment method is passed
        },
      },
    };

    console.log("Initiating payment with data:", paymentInitData);

    // Call the payment initiation endpoint
    const paymentResponse = await axios.post(
      "http://localhost:5000/api/payment/initiate",
      paymentInitData
    );

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
    return res
      .status(500)
      .json({ message: "Error placing order", error: error.message });
  }
};

export const placeCodOrder = async (req, res) => {
  try {
    console.log("COD Order Request Body:", JSON.stringify(req.body));
    const { userId, fullName, address, phoneNumber, items } = req.body;

    // Validate required fields
    if (
      !userId ||
      !fullName ||
      !address ||
      !phoneNumber ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please check the data.",
      });
    }

    // Fetch product details and verify they exist
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products not found.",
      });
    }

    // Create the order items array in the correct format for the Order schema
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        product: product._id,
        quantity: parseInt(item.quantity),
      };
    });

    // Create the new order object for COD
    const newOrder = new Order({
      userId,
      items: orderItems,
      deliveryDetails: {
        fullName,
        address,
        phoneNumber,
      },
      status: "Processing",
      paymentMethod: "COD",
      paymentStatus: "Pending", // For COD, set as pending until delivery
    });

    // Save the order
    const savedOrder = await newOrder.save();
    console.log("Order saved successfully with ID:", savedOrder._id);
    const userCart = await Cart.findOne({ userId });
    if (userCart) {
      userCart.items = []; // Reset the cart items
      await userCart.save(); // Save the empty cart
    }

    // Send confirmation email
    const user = await User.findById(userId);

    if (user) {
      const emailHTML = `
          <h2>Order Confirmed</h2>
          <ul>
            ${orderItems
              .map(
                (i) => `<li>${i.name} - Qty: ${i.quantity} - Rs ${i.price}</li>`
              )
              .join("")}
          </ul>
          <p>Total: Rs {totalAmount}</p>
          <p>Thank you for your order!</p>
        `;
      try {
        await sendEmail(
          user.email,
          "Seeras Makeover - Order Confirmed",
          "Your COD order has been placed successfully",
          emailHTML
        );
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};

// Get all orders for Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .populate("items.product");
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
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

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
  const { userId } = req.params;

  try {
    const purchases = await Order.find({ userId }).populate("items.product");

    res.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases", error);
    res.status(500).json({ message: "Error fetching purchases" });
  }
};
