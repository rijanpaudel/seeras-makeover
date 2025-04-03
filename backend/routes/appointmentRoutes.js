import express from "express";
import { bookAppointment, deleteAppointment, getAllAppointments, updateAppointmentStatus, appointmentHistory } from "../controllers/appointmentController.js";


const router = express.Router();

// Book an appointment
router.post("/book", bookAppointment);

// Get all appointments for Admin
router.get("/all", getAllAppointments);

//Get appointment history for specific user
router.get("/appointmentHistory/:userId", appointmentHistory);

// Update Appointment Status (Admin Only)
router.put("/update/:appointmentId", updateAppointmentStatus);

// Delete Appointment (Admin Only)
router.delete("/delete/:appointmentId", deleteAppointment);

export default router;
