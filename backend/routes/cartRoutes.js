import express from "express";
import { getCartByUserId, addToCart, removeItemFromCart  } from '../controllers/cartController.js';

const router = express.Router();

// Get Cart by User ID
router.get("/:userId", getCartByUserId);

/// Add to Cart Route
router.post("/add", addToCart);


// Remove Item from Cart
router.delete("/remove/:userId/:productId", removeItemFromCart);

export default router;