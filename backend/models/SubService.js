import mongoose from "mongoose";

const subServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String},
  price: { type: Number, required: true },
  duration: { type: String},
  image: { type: String },
  mainService: { type: String, enum: ["Makeup", "Hair", "Nails", "Skin"]}, // Main service association
});

const SubService = mongoose.model("SubService", subServiceSchema);
export default SubService;
