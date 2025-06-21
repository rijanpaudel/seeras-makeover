import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    }
  ],
  deliveryDetails: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  status: { type: String, default: "Pending" },
  paymentMethod: { type: String, enum: ["khalti", "COD"], default: "khalti" },
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  pidx: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: { type: Date, default: Date.now }
});


const Order = mongoose.model("Order", orderSchema);

export default Order;

