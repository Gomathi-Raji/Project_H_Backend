import VacatingRequest from "../models/VacatingRequest.js";
import Tenant from "../models/Tenant.js";

export const getVacatingRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    const requests = await VacatingRequest.find(query)
      .populate("tenant", "firstName lastName email phone")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await VacatingRequest.countDocuments(query);

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

export const getVacatingRequest = async (req, res) => {
  try {
    const request = await VacatingRequest.findById(req.params.id)
      .populate("tenant", "firstName lastName email phone")
      .populate("approvedBy", "name email");
    if (!request) return res.status(404).json({ message: "Vacating request not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTenantVacatingRequests = async (req, res) => {
  try {
    const tenantId = req.user.role === 'tenant' ? req.user.tenantId : req.params.tenantId;
    const requests = await VacatingRequest.find({ tenant: tenantId })
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addVacatingRequest = async (req, res) => {
  try {
    const { vacatingDate, reason, additionalNotes } = req.body;
    const tenantId = req.user.role === 'tenant' ? req.user.tenantId : req.body.tenantId;

    // Check if tenant exists and is active
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    if (!tenant.active) return res.status(400).json({ message: "Tenant is not active" });

    // Check if there's already a pending request
    const existingRequest = await VacatingRequest.findOne({
      tenant: tenantId,
      status: { $in: ['pending', 'approved'] }
    });
    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending or approved vacating request" });
    }

    const request = await VacatingRequest.create({
      tenant: tenantId,
      vacatingDate,
      reason,
      additionalNotes
    });

    const populatedRequest = await VacatingRequest.findById(request._id)
      .populate("tenant", "firstName lastName email phone");

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVacatingRequest = async (req, res) => {
  try {
    const request = await VacatingRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("tenant", "firstName lastName email phone")
      .populate("approvedBy", "name email");
    if (!request) return res.status(404).json({ message: "Vacating request not found" });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVacatingRequest = async (req, res) => {
  try {
    const request = await VacatingRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Vacating request not found" });
    await request.remove();
    res.json({ message: "Vacating request removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};