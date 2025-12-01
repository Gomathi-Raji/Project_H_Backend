import Tenant from "../models/Tenant.js";
import Room from "../models/Room.js";

export const getTenants = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.active = status === 'active';
    }

    const tenants = await Tenant.find(query)
      .populate("room")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tenant.countDocuments(query);

    res.json({
      tenants,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate("room");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTenant = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      aadharNumber,
      room: roomId,
      moveInDate,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      securityDeposit
    } = req.body;

    const tenant = await Tenant.create({
      firstName,
      lastName,
      email,
      phone,
      aadharNumber,
      room: roomId,
      moveInDate,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      securityDeposit
    });

    if (roomId) {
      await Room.findByIdAndUpdate(roomId, { $inc: { occupancy: 1 } });
    }

    const populatedTenant = await Tenant.findById(tenant._id).populate("room");
    res.status(201).json(populatedTenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("room");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    if (tenant.room) {
      await Room.findByIdAndUpdate(tenant.room, { $inc: { occupancy: -1 } });
    }

    await tenant.remove();
    res.json({ message: "Tenant removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTenantStats = async (req, res) => {
  try {
    const totalTenants = await Tenant.countDocuments();
    const activeTenants = await Tenant.countDocuments({ active: true });
    const inactiveTenants = totalTenants - activeTenants;

    const tenantsByRoom = await Tenant.aggregate([
      { $match: { room: { $ne: null } } },
      { $group: { _id: "$room", count: { $sum: 1 } } }
    ]);

    res.json({
      total: totalTenants,
      active: activeTenants,
      inactive: inactiveTenants,
      byRoom: tenantsByRoom
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTenantDashboard = async (req, res) => {
  try {
    const tenantId = req.user.role === 'tenant' ? req.user.tenantId : req.params.tenantId;

    // Get tenant info
    const tenant = await Tenant.findById(tenantId).populate("room");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Get recent payments (last 5)
    const Payment = (await import("../models/Payment.js")).default;
    const recentPayments = await Payment.find({ tenant: tenantId })
      .sort({ paidAt: -1 })
      .limit(5);

    // Get active tickets
    const Ticket = (await import("../models/Ticket.js")).default;
    const activeTickets = await Ticket.find({
      tenant: tenantId,
      status: { $in: ['open', 'in_progress'] }
    }).sort({ createdAt: -1 });

    // Calculate current rent due (simplified - you might want to implement proper rent calculation)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get last payment to determine due date
    const lastPayment = await Payment.findOne({
      tenant: tenantId,
      type: 'rent'
    }).sort({ paidAt: -1 });

    let dueDate = new Date(currentYear, currentMonth + 1, 1); // 1st of next month
    let currentRent = 0;

    if (lastPayment) {
      const lastPaymentDate = new Date(lastPayment.paidAt);
      dueDate = new Date(lastPaymentDate.getFullYear(), lastPaymentDate.getMonth() + 1, lastPaymentDate.getDate());
      currentRent = lastPayment.amount; // Assuming rent amount is consistent
    }

    // Get active issues (open tickets)
    const activeIssues = activeTickets.length;

    res.json({
      userName: `${tenant.firstName} ${tenant.lastName}`,
      currentRent,
      dueDate,
      activeIssues,
      roomNumber: tenant.room ? tenant.room.roomNumber : null,
      recentInvoices: recentPayments,
      activeTickets
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendSMSToTenants = async (req, res) => {
  try {
    const { tenantIds, message } = req.body;

    if (!tenantIds || !Array.isArray(tenantIds) || tenantIds.length === 0) {
      return res.status(400).json({ message: "Tenant IDs array is required" });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ message: "Message is required" });
    }

    const tenants = await Tenant.find({ _id: { $in: tenantIds } }).select('firstName lastName phone');

    if (tenants.length === 0) {
      return res.status(404).json({ message: "No tenants found" });
    }

    const { sendSMS } = await import("../utils/sendSMS.js");

    const results = [];
    for (const tenant of tenants) {
      const fullMessage = `Hello ${tenant.firstName} ${tenant.lastName}, ${message}`;
      const result = await sendSMS(tenant.phone, fullMessage, 'admin-notification');
      results.push({
        tenantId: tenant._id,
        name: `${tenant.firstName} ${tenant.lastName}`,
        phone: tenant.phone,
        success: result.success,
        error: result.error || null
      });
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.json({
      message: `SMS sent to ${successCount} tenants, ${failureCount} failed`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendManualSMS = async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return res.status(400).json({ message: "Phone number is required" });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ message: "Message is required" });
    }

    const { sendSMS } = await import("../utils/sendSMS.js");

    const result = await sendSMS(phone.trim(), message.trim(), 'manual');

    if (result.success) {
      res.json({ message: "SMS sent successfully", sid: result.sid });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
