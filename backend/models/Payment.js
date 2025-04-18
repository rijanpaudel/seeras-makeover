import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  pidx: {
    type: String,
    required: true,
  },
  orderData: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  processed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Order"
  },
  enrollmentId: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' 
  },
  type: { 
    type: String, enum: ['product_order', 'course_enrollment'], default: 'product_order' 
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;