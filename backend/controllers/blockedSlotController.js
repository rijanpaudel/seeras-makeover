import BlockedSlot from "../models/BlockedSlot.js";

// Create a new blocked slot (admin only)
export const createBlockedSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, subServiceId } = req.body;

    const blockedSlot = new BlockedSlot({ date, startTime, endTime, subServiceId });
    await blockedSlot.save();

    res.status(201).json({ message: "Blocked slot created successfully", blockedSlot });
  } catch (error) {
    res.status(500).json({ message: "Error creating blocked slot", error: error.message });
  }
};

// Get all blocked slots (for admin view)
export const getBlockedSlots = async (req, res) => {
  try {
    const slots = await BlockedSlot.find();
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blocked slots", error: error.message });
  }
};

// Update an existing blocked slot
export const updateBlockedSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;

    const slot = await BlockedSlot.findByIdAndUpdate(
      id,
      { date, startTime, endTime },
      { new: true }
    );

    if (!slot) {
      return res.status(404).json({ message: "Blocked slot not found" });
    }

    res.status(200).json({ message: "Blocked slot updated successfully", slot });
  } catch (error) {
    res.status(500).json({ message: "Error updating blocked slot", error: error.message });
  }
};

// Delete a blocked slot
export const deleteBlockedSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await BlockedSlot.findByIdAndDelete(id);

    if (!slot) {
      return res.status(404).json({ message: "Blocked slot not found" });
    }

    res.status(200).json({ message: "Blocked slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blocked slot", error: error.message });
  }
};

export const getBlockedTimes = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date query param is required" });
    }

    // Parse date string to Date object
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('Searching for blocked slots between:', startOfDay, 'and', endOfDay);

    // Find every BlockedSlot whose "date" falls on that day
    const blockedDocs = await BlockedSlot.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const blockedTimesSet = new Set();

    blockedDocs.forEach(slot => {
      // Convert startTime and endTime to total minutes
      const [startH, startM] = slot.startTime.split(":").map(Number);
      const [endH, endM] = slot.endTime.split(":").map(Number);

      let startTotal = startH * 60 + startM;
      let endTotal   = endH * 60 + endM;

      // Ensure start time is before end time
      if (endTotal < startTotal) {
        endTotal = startTotal;
      }

      for (let t = startTotal; t <= endTotal; t += 60) {
        const h = Math.floor(t / 60);
        const m = t % 60;
        const dt = new Date();
        dt.setHours(h, m, 0, 0);

        const timeStr = dt.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });
        blockedTimesSet.add(timeStr);
      }
    });

    // Convert Set to Array so front end can do .includes(...)
    const blockedTimes = Array.from(blockedTimesSet);

    return res.status(200).json({ blockedTimes });
  } catch (error) {
    console.error("Error fetching blocked times:", error);
    return res.status(500).json({
      message: "Error fetching blocked times",
      error: error.message
    });
  }
};