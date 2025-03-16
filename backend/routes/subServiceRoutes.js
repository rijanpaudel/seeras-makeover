import express from "express";
import { addNewService, deleteService, editService, getAllService, getService, getSingleService } from "../controllers/subServiceController.js";

const router = express.Router();

// Add a new sub-service to a main service
router.post("/add", addNewService);

// // Serve images statically
// router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Edit an existing sub-service
router.put("/edit/:id", editService);

// Delete a sub-service
router.delete("/delete/:id", deleteService);

// Get all sub-services
router.get("/", getAllService);

// Get a specific sub-service by ID
router.get("/service/:id", getSingleService);

// Get sub-services by main service
router.get("/:mainService", getService);



export default router;
