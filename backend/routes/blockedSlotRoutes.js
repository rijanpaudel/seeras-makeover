import express from "express";
import { createBlockedSlot, getBlockedSlots, updateBlockedSlot, deleteBlockedSlot, getBlockedTimes } from "../controllers/blockedSlotController.js";

const router = express.Router();

router.post("/create", createBlockedSlot);

router.get("/", getBlockedSlots);

router.get("/blocked-times", getBlockedTimes)

router.put("/update/:id", updateBlockedSlot);

router.delete("/delete/:id", deleteBlockedSlot);

export default router;
