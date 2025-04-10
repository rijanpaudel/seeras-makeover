import express from "express";
import { addNewService, deleteService, editService, getAllService, getService, getSingleService } from "../controllers/subServiceController.js";

const router = express.Router();

// Add a new sub-service to a main service
router.post("/add", addNewService);


// Edit an existing sub-service
router.put("/edit/:subServiceId", editService);

// Delete a sub-service
router.delete("/delete/:subServiceId", deleteService);

// Get all sub-services
router.get("/", getAllService);

// Get a specific sub-service by ID
router.get("/service/:subServiceId", getSingleService);

// Get sub-services by main service
router.get("/:mainService", getService);



export default router;
