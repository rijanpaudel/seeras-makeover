import Appointment from "../models/Appointments.js";
import mongoose from "mongoose";

// Book an appointment
export const bookAppointment = async (req, res) => {
  const { userId, subserviceId, appointmentDate, appointmentTime } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(subserviceId)) {
    return res.status(400).json({ message: "Invalid user or sub service ID format" });
  }

  const appointmentTimeObj = new Date(appointmentDate);
  const [hour, minute] = appointmentTime.split(":");
  appointmentTimeObj.setHours(hour, minute);

  try {
    const newAppointment = new Appointment({
      userId,
      subserviceId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime: appointmentTimeObj,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment Book Successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error booking appoointment:", error);
    res.status(500).json({ message: "Error booking appoointment:", error });
  }
};

// Get all appointments for Admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("userId", "email").populate("subService");
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Update Appointment Status (Admin Only)
export const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { appointmentStatus } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { appointmentStatus }, { new: true });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated successfully", order });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

// Delete Appointment (Admin Only)
export const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting Appointment:", error);
    res.status(500).json({ message: "Error deleting Appointment", error });
  }
};

