import Payment from "../models/Payment.js";

export const getPayments = async (req, res) => {
  try {
    const { search, status, method, type, page = 1, limit = 10, startDate, endDate } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      // This would require populating tenant first, but for simplicity we'll search by reference
      query.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    // Method filter
    if (method && method !== 'all') {
      query.method = method.toLowerCase().replace(' ', '_');
    }

    // Type filter
    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    // Date range filter
    if (startDate || endDate) {
      query.paidAt = {};
      if (startDate) query.paidAt.$gte = new Date(startDate);
      if (endDate) query.paidAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate("tenant", "firstName lastName email phone")
      .sort({ paidAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("tenant", "firstName lastName email phone");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    const populatedPayment = await Payment.findById(payment._id).populate("tenant", "firstName lastName email phone");
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("tenant", "firstName lastName email phone");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    await payment.remove();
    res.json({ message: "Payment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};

    if (startDate || endDate) {
      dateFilter.paidAt = {};
      if (startDate) dateFilter.paidAt.$gte = new Date(startDate);
      if (endDate) dateFilter.paidAt.$lte = new Date(endDate);
    }

    const totalPayments = await Payment.countDocuments(dateFilter);
    const totalAmount = await Payment.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const paymentsByStatus = await Payment.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    const paymentsByMethod = await Payment.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$method", count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    const paymentsByType = await Payment.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$type", count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    const monthlyPayments = await Payment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" }
          },
          count: { $sum: 1 },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json({
      total: totalPayments,
      totalAmount: totalAmount[0]?.total || 0,
      byStatus: paymentsByStatus,
      byMethod: paymentsByMethod,
      byType: paymentsByType,
      monthly: monthlyPayments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTenantPayments = async (req, res) => {
  try {
    const tenantId = req.user.role === 'tenant' ? req.user.tenantId : req.params.tenantId;
    const { status, type, page = 1, limit = 10 } = req.query;

    let query = { tenant: tenantId };

    // Status filter
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    // Type filter
    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    const payments = await Payment.find(query)
      .sort({ paidAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
