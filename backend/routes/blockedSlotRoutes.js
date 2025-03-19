import express from "express";
import { createBlockedSlot, getBlockedSlots, updateBlockedSlot, deleteBlockedSlot } from "../controllers/blockedSlotController.js";

const router = express.Router();

router.post("/create", createBlockedSlot);

router.get("/", getBlockedSlots);

router.put("/update/:id", updateBlockedSlot);

router.delete("/delete/:id", deleteBlockedSlot);

export default router;
