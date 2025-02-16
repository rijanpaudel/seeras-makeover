import mongoose from "mongoose";

// Define the service schema
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  description: { type: String, required: true },  
  subServices: [{  
    name: { type: String, required: true }, 
    description: { type: String, required: true },
  }]
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);
export default Service;
