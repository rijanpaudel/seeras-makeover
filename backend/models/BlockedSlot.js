import mongoose from "mongoose";

const blockedSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },   
});

const BlockedSlot = mongoose.model("BlockedSlot", blockedSlotSchema);
export default BlockedSlot;
