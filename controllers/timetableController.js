import Timetable from "../models/Timetable.js";

export const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find({ isActive: true }).sort({ priority: -1 });

    // If no timetable items exist, create default timetable
    if (timetable.length === 0) {
      const defaultTimetable = [
        { activity: "Wake Up Time", time: "6:00 AM", description: "Morning wake up and freshen up", priority: 10 },
        { activity: "Breakfast", time: "7:00 AM - 9:00 AM", description: "Morning meal", priority: 9 },
        { activity: "Study Time", time: "9:00 AM - 11:00 AM", description: "Morning study session", priority: 8 },
        { activity: "Lunch", time: "12:00 PM - 2:00 PM", description: "Afternoon meal", priority: 7 },
        { activity: "Rest Time", time: "2:00 PM - 4:00 PM", description: "Afternoon rest", priority: 6 },
        { activity: "Snacks", time: "4:00 PM - 5:00 PM", description: "Evening snacks", priority: 5 },
        { activity: "Evening Study", time: "5:00 PM - 7:00 PM", description: "Evening study session", priority: 4 },
        { activity: "Dinner", time: "7:00 PM - 9:00 PM", description: "Evening meal", priority: 3 },
        { activity: "Study Hours", time: "9:00 PM - 11:00 PM", description: "Night study session", priority: 2 },
        { activity: "Lights Off", time: "11:00 PM", description: "Bed time", priority: 1 },
      ];

      await Timetable.insertMany(defaultTimetable);
      const newTimetable = await Timetable.find({ isActive: true }).sort({ priority: -1 });
      return res.json(newTimetable);
    }

    res.json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateTimetable = async (req, res) => {
  try {
    const { activity, time, description, priority } = req.body;

    const updatedTimetable = await Timetable.findOneAndUpdate(
      { activity },
      { time, description, priority },
      { new: true, upsert: true }
    );

    res.json({ message: "Timetable updated successfully", timetable: updatedTimetable });
  } catch (error) {
    console.error("Error updating timetable:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addTimetableItem = async (req, res) => {
  try {
    const { activity, time, description, priority } = req.body;

    const newItem = await Timetable.create({
      activity,
      time,
      description,
      priority,
    });

    res.status(201).json({ message: "Timetable item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding timetable item:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTimetableItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Timetable.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedItem) {
      return res.status(404).json({ message: "Timetable item not found" });
    }

    res.json({ message: "Timetable item deleted successfully" });
  } catch (error) {
    console.error("Error deleting timetable item:", error);
    res.status(500).json({ message: error.message });
  }
};