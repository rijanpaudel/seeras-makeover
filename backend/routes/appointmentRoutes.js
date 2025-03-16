import express from "express";
import { bookAppointment, deleteAppointment, getAllAppointments, updateAppointmentStatus } from "../controllers/appointmentController";


const router = express.Router();

// Book an appointment
router.post("/book", bookAppointment);

// Get all appointments for Admin
router.get("/all", getAllAppointments);

// Update Appointment Status (Admin Only)
router.put("/update/:appointmentId", updateAppointmentStatus);

// Delete Appointment (Admin Only)
router.delete("/delete/:appointmentId", deleteAppointment);

export default router;
