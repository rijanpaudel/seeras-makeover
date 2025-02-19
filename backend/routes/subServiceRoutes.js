import express from "express";
import SubService from "../models/SubService.js";

const router = express.Router();

// Add a new sub-service to a main service
router.post("/add", async (req, res) => {
  try {
    const { name, description, price, duration, mainService } = req.body;

    // Validate that main service is one of the predefined ones
    if (!["Makeup", "Hair", "Nails"].includes(mainService)) {
      return res.status(400).json({ message: "Invalid main service" });
    }

    const newSubService = new SubService({
      name,
      description,
      price,
      duration,
      mainService,
    });

    await newSubService.save();
    res.status(201).json({ message: "Sub-service added successfully", subService: newSubService });
  } catch (error) {
    res.status(500).json({ message: "Error adding sub-service", error });
  }
});

// Edit an existing sub-service
router.put("/edit/:id", async (req, res) => {
  try {
    const { name, description, price, duration, mainService } = req.body;
    const subService = await SubService.findById(req.params.id);

    if (!subService) {
      return res.status(404).json({ message: "Sub-service not found" });
    }

    if (mainService && !["Makeup", "Hair", "Nails"].includes(mainService)) {
      return res.status(400).json({ message: "Invalid main service" });
    }

    subService.name = name || subService.name;
    subService.description = description || subService.description;
    subService.price = price || subService.price;
    subService.duration = duration || subService.duration;
    subService.mainService = mainService || subService.mainService;

    await subService.save();
    res.status(200).json({ message: "Sub-service updated successfully", subService });
  } catch (error) {
    res.status(500).json({ message: "Error updating sub-service", error });
  }
});

// Delete a sub-service
router.delete("/delete/:id", async (req, res) => {
  try {
    const subService = await SubService.findById(req.params.id);

    if (!subService) {
      return res.status(404).json({ message: "Sub-service not found" });
    }

    await subService.remove();
    res.status(200).json({ message: "Sub-service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sub-service", error });
  }
});

// Get all sub-services
router.get("/", async (req, res) => {
  try {
    const subServices = await SubService.find();
    res.status(200).json(subServices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sub-services", error });
  }
});

// Get sub-services by main service
router.get("/:mainService", async (req, res) => {
  const { mainService } = req.params;

  if (!["Makeup", "Hair", "Nails"].includes(mainService)) {
    return res.status(400).json({ message: "Invalid main service" });
  }

  try {
    const subServices = await SubService.find({ mainService });
    res.status(200).json(subServices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sub-services", error });
  }
});

export default router;
