import Menu from "../models/Menu.js";

export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find({ isActive: true }).sort({ day: 1 });

    // If no menu items exist, create default menu
    if (menu.length === 0) {
      const defaultMenu = [
        { day: "Monday", breakfast: "Idli, Sambar, Chutney", lunch: "Rice, Dal, Vegetable, Roti", dinner: "Chapati, Curry, Rice" },
        { day: "Tuesday", breakfast: "Dosa, Sambar, Chutney", lunch: "Rice, Sambar, Vegetable", dinner: "Rice, Dal, Vegetable" },
        { day: "Wednesday", breakfast: "Pongal, Vadai", lunch: "Rice, Rasam, Vegetable", dinner: "Chapati, Paneer Curry" },
        { day: "Thursday", breakfast: "Poori, Potato Masala", lunch: "Rice, Dal, Vegetable, Pickle", dinner: "Rice, Sambar, Vegetable" },
        { day: "Friday", breakfast: "Idli, Sambar, Chutney", lunch: "Rice, Dal, Vegetable", dinner: "Chapati, Mixed Vegetable" },
        { day: "Saturday", breakfast: "Dosa, Sambar, Chutney", lunch: "Rice, Rasam, Vegetable", dinner: "Rice, Dal, Vegetable" },
        { day: "Sunday", breakfast: "Pongal, Vadai", lunch: "Rice, Sambar, Vegetable", dinner: "Chapati, Chicken Curry" },
      ];

      await Menu.insertMany(defaultMenu);
      const newMenu = await Menu.find({ isActive: true }).sort({ day: 1 });
      return res.json(newMenu);
    }

    res.json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const { day, breakfast, lunch, dinner, snacks } = req.body;

    const updatedMenu = await Menu.findOneAndUpdate(
      { day, isActive: true },
      { breakfast, lunch, dinner, snacks },
      { new: true, upsert: true }
    );

    res.json({ message: "Menu updated successfully", menu: updatedMenu });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMenuByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const menu = await Menu.findOne({ day, isActive: true });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found for this day" });
    }

    res.json(menu);
  } catch (error) {
    console.error("Error fetching menu by day:", error);
    res.status(500).json({ message: error.message });
  }
};