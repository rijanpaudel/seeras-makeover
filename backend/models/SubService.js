import mongoose from "mongoose";

const subServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  image: { type: String },
  mainService: { type: String, enum: ["Makeup", "Hair", "Nails", "Skin"], required: true }, // Main service association
});

const SubService = mongoose.model("SubService", subServiceSchema);
export default SubService;
