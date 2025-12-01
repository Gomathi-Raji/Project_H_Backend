import Ticket from "../models/Ticket.js";

export const getTickets = async (req, res) => {
  try {
    const { search, status, priority, category, page = 1, limit = 10 } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status.toLowerCase().replace(' ', '_');
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority.toLowerCase();
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category.toLowerCase();
    }

    const tickets = await Ticket.find(query)
      .populate("tenant")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Ticket.countDocuments(query);

    res.json({
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("tenant")
      .populate("assignedTo", "name email");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("tenant")
      .populate("assignedTo", "name email");
    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("tenant")
      .populate("assignedTo", "name email");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    await ticket.remove();
    res.json({ message: "Ticket removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in_progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'closed' });

    const ticketsByPriority = await Ticket.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const ticketsByCategory = await Ticket.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json({
      total: totalTickets,
      open: openTickets,
      inProgress: inProgressTickets,
      resolved: resolvedTickets,
      closed: closedTickets,
      byPriority: ticketsByPriority,
      byCategory: ticketsByCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTenantTickets = async (req, res) => {
  try {
    const tenantId = req.user.role === 'tenant' ? req.user.tenantId : req.params.tenantId;

    const tickets = await Ticket.find({ tenant: tenantId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
