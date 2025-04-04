import express from "express";
import { totalAppointment, totalUsers, totalCourses, recentAppointments } from "../controllers/adminController.js";

const router = express.Router();

router.get('/appointments/count', totalAppointment);

router.get('/customers/active', totalUsers);

router.get('/courses/ongoing', totalCourses);

router.get('/appointments/recent', recentAppointments);

export default router;