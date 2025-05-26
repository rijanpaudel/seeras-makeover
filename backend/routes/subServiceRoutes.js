import express from "express";
import multer from "multer";
import path from "path";
import { addNewService, deleteService, editService, getAllService, getService, getSingleService } from "../controllers/subServiceController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Add a new sub-service to a main service
router.post("/add", upload.single("image"), addNewService);

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
