import AppointmentSlot from "../models/AppointmentSlot.js";

export const addSlot = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const newSlot = new Slot({ date, startTime, endTime });
    await newSlot.save();
    res.status(201).json({ message: "Slot created successfully", slot: newSlot });
  } catch (error) {
    res.status(500).json({ message: "Error creating slot", error });
  }
};

export const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, isBooked } = req.body;
    const updatedSlot = await AppointmentSlot.findByIdAndUpdate(
      id,
      { date, startTime, endTime, isBooked },
      { new: true }
    );
    if (!updatedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.status(200).json({ message: "Slot updated successfully", slot: updatedSlot });
  } catch (error) {
    res.status(500).json({ message: "Error updating slot", error });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await AppointmentSlot.findByIdAndDelete(id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting slot", error });
  }
};

export const getSlots = async (req, res) => {
  try {
    // You could filter for available slots by adding { isBooked: false } if needed.
    const slots = await AppointmentSlot.find();
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error });
  }
};
