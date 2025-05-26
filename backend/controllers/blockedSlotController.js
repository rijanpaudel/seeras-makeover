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
    const { date, subServiceId } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date query param is required" });
    }

    // Parse date string to Date object
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Build the query for finding blocked slots
    const query = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      }
    };

    // Only add subServiceId to query if it exists
    if (subServiceId) {
      query.subServiceId = subServiceId;
    }

    const blocked = await BlockedSlot.find(query);

    // Format times to match what's displayed in the UI
    const blockedTimes = blocked.map(slot => {
      const [h, m] = slot.startTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    });

    res.status(200).json({ blockedTimes });
  } catch (error) {
    console.error("Error fetching blocked times:", error);
    res.status(500).json({ message: "Error fetching blocked times", error: error.message });
  }
};