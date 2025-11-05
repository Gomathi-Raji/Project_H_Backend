import Tenant from "../models/Tenant.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

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
      .populate("userId", "name email phone role")
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
    const tenant = await Tenant.findById(req.params.id)
      .populate("room")
      .populate("userId", "name email phone role");
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
      securityDeposit,
      password // Optional: if not provided, generate a default password
    } = req.body;

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Generate default password if not provided
    const defaultPassword = password || "password123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Create User account first
    const user = await User.create({
      name: `${firstName} ${lastName || ''}`.trim(),
      email,
      phone,
      password: hashedPassword,
      role: "tenant"
    });

    // Create Tenant record linked to User
    const tenant = await Tenant.create({
      userId: user._id,
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

    // Update User with tenantId reference
    await User.findByIdAndUpdate(user._id, { tenantId: tenant._id });

    // Update room occupancy if room is assigned
    if (roomId) {
      await Room.findByIdAndUpdate(roomId, { $inc: { occupancy: 1 } });
    }

    const populatedTenant = await Tenant.findById(tenant._id)
      .populate("room")
      .populate("userId", "name email phone role");

    res.status(201).json({
      ...populatedTenant.toObject(),
      generatedPassword: password ? undefined : defaultPassword // Only return generated password if it was auto-generated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("room")
      .populate("userId", "name email phone role");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // If email is being updated, also update the linked User account
    if (req.body.email && tenant.userId) {
      await User.findByIdAndUpdate(tenant.userId._id, { email: req.body.email });
    }

    // If phone is being updated, also update the linked User account
    if (req.body.phone && tenant.userId) {
      await User.findByIdAndUpdate(tenant.userId._id, { phone: req.body.phone });
    }

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Delete associated User account
    if (tenant.userId) {
      await User.findByIdAndDelete(tenant.userId);
    }

    // Update room occupancy
    if (tenant.room) {
      await Room.findByIdAndUpdate(tenant.room, { $inc: { occupancy: -1 } });
    }

    // Delete tenant record
    await Tenant.findByIdAndDelete(req.params.id);
    res.json({ message: "Tenant and associated user account removed successfully" });
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
    // For tenant users, get tenantId from their User record
    // For admin/staff, tenantId comes from params
    let tenantId = req.params.tenantId;

    if (req.user.role === 'tenant') {
      tenantId = req.user.tenantId;
    }

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID not found" });
    }

    // Get tenant info with user details
    const tenant = await Tenant.findById(tenantId)
      .populate("room")
      .populate("userId", "name email phone role isFirstLogin");
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
    let currentRent = tenant.room?.rent || 0;

    if (lastPayment) {
      const lastPaymentDate = new Date(lastPayment.paidAt);
      dueDate = new Date(lastPaymentDate.getFullYear(), lastPaymentDate.getMonth() + 1, lastPaymentDate.getDate());
    }

    // Get active issues (open tickets)
    const activeIssues = activeTickets.length;

    res.json({
      userName: `${tenant.firstName} ${tenant.lastName || ''}`.trim(),
      currentRent,
      dueDate,
      activeIssues,
      roomNumber: tenant.room ? tenant.room.number : null,
      recentInvoices: recentPayments,
      activeTickets,
      userDetails: tenant.userId, // Include user account details
      tenantDetails: tenant // Include full tenant details
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const onboardTenant = async (req, res) => {
  try {
    const {
      aadharNumber,
      room,
      moveInDate,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactPhone,
      securityDeposit,
      currentRent,
      dueDate
    } = req.body;

    // Get tenant ID from authenticated user
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID not found. Please contact administrator." });
    }

    // Update tenant record with onboarding information
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      {
        aadharNumber,
        room,
        moveInDate,
        emergencyContactName,
        emergencyContactRelationship,
        emergencyContactPhone,
        securityDeposit,
        active: true // Mark as active after onboarding
      },
      { new: true }
    ).populate('room');

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Update room occupancy
    if (room) {
      await Room.findByIdAndUpdate(room, { $inc: { occupancy: 1 } });
    }

    // Create initial payment record for rent setup
    const Payment = (await import("../models/Payment.js")).default;
    await Payment.create({
      tenant: tenantId,
      amount: currentRent,
      type: 'rent',
      status: 'pending',
      dueDate: new Date(dueDate),
      description: 'Monthly rent'
    });

    res.json({
      message: "Onboarding completed successfully",
      tenant: updatedTenant
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ message: error.message });
  }
};
