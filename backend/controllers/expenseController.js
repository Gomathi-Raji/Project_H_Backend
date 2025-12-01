import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10, startDate, endDate } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category.toLowerCase();
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate("approvedBy", "name")
      .populate("paidBy", "name")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("approvedBy", "name")
      .populate("paidBy", "name");
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    const populatedExpense = await Expense.findById(expense._id)
      .populate("approvedBy", "name")
      .populate("paidBy", "name");
    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("approvedBy", "name")
      .populate("paidBy", "name");
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    await expense.remove();
    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};

    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const totalExpenses = await Expense.countDocuments(dateFilter);
    const totalAmount = await Expense.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expensesByCategory = await Expense.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$category", count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    const expensesByStatus = await Expense.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    const monthlyExpenses = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          count: { $sum: 1 },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json({
      total: totalExpenses,
      totalAmount: totalAmount[0]?.total || 0,
      byCategory: expensesByCategory,
      byStatus: expensesByStatus,
      monthly: monthlyExpenses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};