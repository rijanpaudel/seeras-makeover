import express from "express";
import User from "../models/User.js"
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// Add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    //Find user and product
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //Find if the product is already in the cart
    let cart = await Cart.findOne( { userId });

    if(!cart){
      //If no cart exists for the user, create new one
      cart = new Cart({
        userId,
        items: [],
      });
    }
      // Check if the product already exists in the cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // If the item already exists, update the quantity
       existingItem.quantity += quantity;
      } else {
        // If the item doesn't exist, add it to the cart
        cart.items.push({ 
          product: productId, 
          quantity,
        });
      }
    await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart", error: error.message });
  }
});

// Get cart for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

export default router;
