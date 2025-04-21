import express from "express";
import { bookAppointment, deleteAppointment, getAllAppointments, updateAppointmentStatus, appointmentHistory, getBookedTimes, getRecentAppointments, getMonthlyAppointments, getServiceDistribution } from "../controllers/appointmentController.js";
import { get } from "mongoose";
import { getService } from "../controllers/subServiceController.js";


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

router.get("/booked-times", getBookedTimes);

router.get('/recent', getRecentAppointments);

router.get('/monthly', getMonthlyAppointments);

router.get('/services-distribution', getServiceDistribution)

export default router;
