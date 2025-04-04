import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subServiceId: { type: mongoose.Schema.Types.ObjectId, ref: "SubService", required: true },
  appointmentDateTime: { type: Date, required: true },
  status: { type: String, default: "Pending" }, // Appointment status (Pending, Delivered, etc.)
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
