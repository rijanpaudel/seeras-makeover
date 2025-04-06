import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


// Validate ObjectId function
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get Cart by User ID
export const getCartByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({ userId, items: [] }); // Always return items as an array
    }

    console.log("Returning Cart Data:", cart); // Debugging
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};



/// Add to Cart Route
export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Validate MongoDB ObjectIds
  if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid user or product ID format" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Find Product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart!", cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart", error: error.message });
  }
};


// Remove Item from Cart
export const removeItemFromCart = async (req, res) => {
  if (!isValidObjectId(req.params.userId) || !isValidObjectId(req.params.productId)) {
    return res.status(400).json({ message: "Invalid user or product ID format" });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { items: { product: req.params.productId } } },
      { new: true }
    );

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

export const clearCart =  async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
