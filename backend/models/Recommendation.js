import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recommendedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubService" }],
  recommendedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  lastUpdated: { type: Date, default: Date.now }
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);
export default Recommendation;