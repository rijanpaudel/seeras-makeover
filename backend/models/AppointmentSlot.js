import mongoose from "mongoose";

const appointmentSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }, 
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

const AppointmentSlot = mongoose.model("AppointmentSlot", appointmentSlotSchema);
export default AppointmentSlot;
