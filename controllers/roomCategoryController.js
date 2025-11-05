import RoomCategory from "../models/RoomCategory.js";

export const getTenantRoomCategory = async (req, res) => {
  try {
    const Tenant = (await import("../models/Tenant.js")).default;
    const tenant = await Tenant.findById(req.user.tenantId).populate('room');

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    if (!tenant.room) {
      return res.json({
        roomType: "Not Assigned",
        roomNumber: "Not Assigned",
        floor: "Not Assigned",
        amenities: [],
        status: "Not Assigned"
      });
    }

    // Get room category information based on room type
    const roomCategories = {
      single: {
        name: "Single Sharing",
        amenities: ["AC", "Attached Bathroom", "WiFi", "Study Table", "Wardrobe", "Single Bed"],
        description: "Private room for one person"
      },
      double: {
        name: "Double Sharing (AC)",
        amenities: ["AC", "Attached Bathroom", "WiFi", "Study Table", "Wardrobe", "Two Beds"],
        description: "Shared room for two people with AC"
      },
      shared: {
        name: "Triple Sharing",
        amenities: ["Fan", "Common Bathroom", "WiFi", "Study Table", "Wardrobe", "Three Beds"],
        description: "Shared room for three people"
      }
    };

    const roomCategory = roomCategories[tenant.room.type] || {
      name: "Standard Room",
      amenities: ["WiFi", "Study Table", "Wardrobe"],
      description: "Standard accommodation"
    };

    // Determine floor from room number (assuming format like "101", "201", etc.)
    const roomNumber = tenant.room.number;
    const floor = roomNumber.length >= 3 ? roomNumber.charAt(0) + "st Floor" :
                 roomNumber.length >= 2 ? "Ground Floor" : "Not Specified";

    res.json({
      roomType: roomCategory.name,
      roomNumber: roomNumber,
      floor: floor,
      amenities: roomCategory.amenities,
      description: roomCategory.description,
      status: tenant.room.status,
      capacity: tenant.room.capacity,
      occupancy: tenant.room.occupancy
    });

  } catch (error) {
    console.error("Error fetching room category:", error);
    res.status(500).json({ message: "Failed to fetch room category information" });
  }
};

export const getRoomCategories = async (req, res) => {
  try {
    const categories = await RoomCategory.find({ isActive: true }).sort({ price: 1 });

    // If no categories exist, create default categories
    if (categories.length === 0) {
      const defaultCategories = [
        {
          name: "Single Sharing (Non-AC)",
          description: "Private room with basic amenities",
          price: 8000,
          amenities: ["Attached Bathroom", "WiFi", "Study Table", "Wardrobe"],
          capacity: 1,
          isAC: false,
          hasAttachedBathroom: true,
          hasBalcony: false,
        },
        {
          name: "Double Sharing (Non-AC)",
          description: "Shared room for two students",
          price: 5000,
          amenities: ["Attached Bathroom", "WiFi", "Study Table", "Wardrobe"],
          capacity: 2,
          isAC: false,
          hasAttachedBathroom: true,
          hasBalcony: false,
        },
        {
          name: "Double Sharing (AC)",
          description: "Shared room with AC for two students",
          price: 7000,
          amenities: ["AC", "Attached Bathroom", "WiFi", "Study Table", "Wardrobe"],
          capacity: 2,
          isAC: true,
          hasAttachedBathroom: true,
          hasBalcony: false,
        },
        {
          name: "Triple Sharing (Non-AC)",
          description: "Shared room for three students",
          price: 4000,
          amenities: ["Common Bathroom", "WiFi", "Study Table", "Wardrobe"],
          capacity: 3,
          isAC: false,
          hasAttachedBathroom: false,
          hasBalcony: false,
        },
      ];

      await RoomCategory.insertMany(defaultCategories);
      const newCategories = await RoomCategory.find({ isActive: true }).sort({ price: 1 });
      return res.json(newCategories);
    }

    res.json(categories);
  } catch (error) {
    console.error("Error fetching room categories:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getRoomCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await RoomCategory.findById(id);

    if (!category || !category.isActive) {
      return res.status(404).json({ message: "Room category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching room category:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createRoomCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const category = await RoomCategory.create(categoryData);
    res.status(201).json({ message: "Room category created successfully", category });
  } catch (error) {
    console.error("Error creating room category:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateRoomCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await RoomCategory.findByIdAndUpdate(id, updateData, { new: true });

    if (!category) {
      return res.status(404).json({ message: "Room category not found" });
    }

    res.json({ message: "Room category updated successfully", category });
  } catch (error) {
    console.error("Error updating room category:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoomCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await RoomCategory.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Room category not found" });
    }

    res.json({ message: "Room category deleted successfully" });
  } catch (error) {
    console.error("Error deleting room category:", error);
    res.status(500).json({ message: error.message });
  }
};