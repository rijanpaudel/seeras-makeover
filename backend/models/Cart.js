import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Link to the product collection
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
