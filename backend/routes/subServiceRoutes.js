import express from "express";
import SubService from "../models/SubService.js";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //Save images in upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Unique filename
  }
});

const upload = multer({ storage });

// Add a new sub-service to a main service
router.post("/add", upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, duration, mainService } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate that main service is one of the predefined ones
    if (!["Makeup", "Hair", "Nails", "Skin"].includes(mainService)) {
      return res.status(400).json({ message: "Invalid main service" });
    }

    const newSubService = new SubService({
      name,
      description,
      price,
      duration,
      image,
      mainService,
    });

    await newSubService.save();
    res.status(201).json({ message: "Sub-service added successfully", subService: newSubService });
  } catch (error) {
    res.status(500).json({ message: "Error adding sub-service", error });
  }
});

// Serve images statically
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Edit an existing sub-service
router.put("/edit/:id", upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, duration, mainService } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (mainService && !["Makeup", "Hair", "Nails", "Skin"].includes(mainService)) {
      return res.status(400).json({ message: "Invalid main service" });
    }

    const updatedFields = { name, description, price, duration, mainService };
    if (image) updatedFields.image = image;

    const subService = await SubService.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!subService) {
      return res.status(404).json({ message: "Sub-service not found" });
    }

    res.status(200).json({ message: "Sub-service updated successfully", subService });
  } catch (error) {
    console.error("Error updating sub-service:", error);
    res.status(500).json({ message: "Error updating sub-service", error });
  }
});

// Delete a sub-service
router.delete("/delete/:id", async (req, res) => {
  try {
    const subService = await SubService.findByIdAndDelete(req.params.id);

    if (!subService) {
      return res.status(404).json({ message: "Sub-service not found" });
    }

    res.status(200).json({ message: "Sub-service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sub-service", error });
  }
});

// Get all sub-services
router.get("/", async (req, res) => {
  try {
    const subServices = await SubService.find();

    if (!subServices) {
      return res.status(404).json({ message: "Sub-service not found" });
    }

    res.status(200).json(subServices);
  } catch (error) {
    console.error("Error fetching sub-service:", error);
    res.status(500).json({ message: "Error fetching sub-services", error });
  }
});

// Get a specific sub-service by ID
router.get("/service/:id", async (req, res) => {
  try {
    const subService = await SubService.findById(req.params.id);

    if (!subService) {
      return res.status(404).json({ message: "Sub-service not found" });
    }

    res.status(200).json(subService);  
  } catch (error) {
    console.error("Error fetching sub-service:", error);
    res.status(500).json({ message: "Error fetching sub-service", error });
  }
});

// Get sub-services by main service
router.get("/:mainService", async (req, res) => {
  const { mainService } = req.params;

  if (!["Makeup", "Hair", "Nails", "Skin"].includes(mainService)) {
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
