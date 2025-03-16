import express from "express";
import { placeOrder, getAllOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();

// Place an order
router.post("/place", placeOrder);

// Get all orders for Admin
router.get("/all", getAllOrders);

// Update Order Status (Admin Only)
router.put("/update/:orderId", updateOrderStatus);

// Delete Order (Admin Only)
router.delete("/delete/:orderId", deleteOrder);

export default router;
