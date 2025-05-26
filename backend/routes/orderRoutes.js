import express from "express";
import { placeOrder, getAllOrders, updateOrderStatus, deleteOrder, getPurchaseDetails, placeCodOrder } from "../controllers/orderController.js";

const router = express.Router();

// Place an order
router.post("/place", placeOrder);

router.post("/place-cod", placeCodOrder);

// Get all orders for Admin
router.get("/all", getAllOrders);

//Get purchase details for user
router.get("/purchases/:userId", getPurchaseDetails);

// Update Order Status (Admin Only)
router.put("/update/:orderId", updateOrderStatus);

// Delete Order (Admin Only)
router.delete("/delete/:orderId", deleteOrder);

export default router;