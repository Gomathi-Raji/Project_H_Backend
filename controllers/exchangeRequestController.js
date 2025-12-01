import ExchangeRequest from "../models/ExchangeRequest.js";
import Tenant from "../models/Tenant.js";
import Room from "../models/Room.js";

export const getExchangeRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    const requests = await ExchangeRequest.find(query)
      .populate("tenant", "firstName lastName email phone")
      .populate("currentRoom", "roomNumber floor capacity")
      .populate("desiredRoom", "roomNumber floor capacity")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ExchangeRequest.countDocuments(query);

    res.json({
      requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExchangeRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id)
      .populate("tenant", "firstName lastName email phone")
      .populate("currentRoom", "roomNumber floor capacity")
      .populate("desiredRoom", "roomNumber floor capacity")
      .populate("approvedBy", "name email");
    if (!request) return res.status(404).json({ message: "Exchange request not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTenantExchangeRequests = async (req, res) => {
  try {
    const tenantId = req.user.role === 'tenant' ? req.user.tenantId : req.params.tenantId;
    const requests = await ExchangeRequest.find({ tenant: tenantId })
      .populate("currentRoom", "roomNumber floor capacity")
      .populate("desiredRoom", "roomNumber floor capacity")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addExchangeRequest = async (req, res) => {
  try {
    const { currentRoom, desiredRoom, reason, preferredDate, additionalNotes } = req.body;
    const tenantId = req.user.role === 'tenant' ? req.user.tenantId : req.body.tenantId;

    // Check if tenant exists and is active
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    if (!tenant.active) return res.status(400).json({ message: "Tenant is not active" });

    // Check if current room matches tenant's room
    if (req.user.role === 'tenant' && tenant.room._id.toString() !== currentRoom) {
      return res.status(400).json({ message: "Current room does not match your assigned room" });
    }

    // Check if desired room exists and has capacity
    const desiredRoomDoc = await Room.findById(desiredRoom);
    if (!desiredRoomDoc) return res.status(404).json({ message: "Desired room not found" });
    if (desiredRoomDoc.occupancy >= desiredRoomDoc.capacity) {
      return res.status(400).json({ message: "Desired room is at full capacity" });
    }

    // Check if there's already a pending request
    const existingRequest = await ExchangeRequest.findOne({
      tenant: tenantId,
      status: { $in: ['pending', 'approved'] }
    });
    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending or approved exchange request" });
    }

    const request = await ExchangeRequest.create({
      tenant: tenantId,
      currentRoom,
      desiredRoom,
      reason,
      preferredDate,
      additionalNotes
    });

    const populatedRequest = await ExchangeRequest.findById(request._id)
      .populate("tenant", "firstName lastName email phone")
      .populate("currentRoom", "roomNumber floor capacity")
      .populate("desiredRoom", "roomNumber floor capacity");

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExchangeRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("tenant", "firstName lastName email phone")
      .populate("currentRoom", "roomNumber floor capacity")
      .populate("desiredRoom", "roomNumber floor capacity")
      .populate("approvedBy", "name email");
    if (!request) return res.status(404).json({ message: "Exchange request not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExchangeRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Exchange request not found" });
    await request.remove();
    res.json({ message: "Exchange request removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};