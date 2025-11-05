import FeeBreakdown from "../models/FeeBreakdown.js";
import Tenant from "../models/Tenant.js";

export const getFeeBreakdown = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID not found in user profile" });
    }

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    // Find or create fee breakdown for current month
    let feeBreakdown = await FeeBreakdown.findOne({
      tenantId,
      month: currentMonth,
      year: currentYear,
    });

    if (!feeBreakdown) {
      // Create default fee breakdown if not exists
      feeBreakdown = await FeeBreakdown.create({
        tenantId,
        month: currentMonth,
        year: currentYear,
      });
    }

    res.json(feeBreakdown);
  } catch (error) {
    console.error("Error fetching fee breakdown:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateFeeBreakdown = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { roomRent, electricityCharges, waterCharges, maintenance } = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID not found in user profile" });
    }

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const totalMonthlyFee = (roomRent || 0) + (electricityCharges || 0) + (waterCharges || 0) + (maintenance || 0);

    const feeBreakdown = await FeeBreakdown.findOneAndUpdate(
      { tenantId, month: currentMonth, year: currentYear },
      {
        roomRent: roomRent || 5000,
        electricityCharges: electricityCharges || 800,
        waterCharges: waterCharges || 300,
        maintenance: maintenance || 500,
        totalMonthlyFee,
      },
      { new: true, upsert: true }
    );

    res.json({ message: "Fee breakdown updated successfully", feeBreakdown });
  } catch (error) {
    console.error("Error updating fee breakdown:", error);
    res.status(500).json({ message: error.message });
  }
};