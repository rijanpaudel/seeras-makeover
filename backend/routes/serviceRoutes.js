import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// Add a new sub-service to an existing service
router.post("/add-subservice", async (req, res) => {
  try {
    const { serviceName, subServiceName, subServiceDescription } = req.body;

    // Find the service by its name
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    // Add the new sub-service to the service's subServices array
    service.subServices.push({
      name: subServiceName,
      description: subServiceDescription,
    });

    await service.save();
    res.status(200).json({ message: "Sub-service added successfully!", service });
  } catch (error) {
    console.error("Error adding sub-service:", error);
    res.status(500).json({ message: "Error adding sub-service", error });
  }
});

export default router;
