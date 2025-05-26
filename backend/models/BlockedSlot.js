import mongoose from "mongoose";

const blockedSlotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }, 
  subServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubService' },  
});

const BlockedSlot = mongoose.model("BlockedSlot", blockedSlotSchema);
export default BlockedSlot;
