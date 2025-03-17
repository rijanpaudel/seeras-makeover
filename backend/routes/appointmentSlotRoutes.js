
import express from "express";
import { addSlot, updateSlot, deleteSlot, getSlots } from "../controllers/appointmentSlotController.js";
const router = express.Router();

router.post("/add", addSlot);
router.put("/update/:id", updateSlot);
router.delete("/delete/:id", deleteSlot);
router.get("/", getSlots);

export default router;
