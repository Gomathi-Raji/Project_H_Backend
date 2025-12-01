import React, { useState, useEffect } from "react";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  Zap,
  Wrench,
  Package,
  Users,
  X,
  Save,
} from "lucide-react";
import apiFetch from '@/lib/apiClient';

const ExpensesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    paid: 0,
    paidAmount: 0,
    pending: 0,
    pendingAmount: 0,
    approved: 0,
    approvedAmount: 0
  });
  
  // Form state
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    amount: "",
    description: "",
    supplier: "",
    paymentMethod: "Bank Transfer",
    date: "",
    dueDate: "",
    status: "Pending"
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Predefined categories with icons
  const defaultCategories = [
    { id: "utilities", name: "Utilities", icon: Zap, color: "text-yellow-600" },
    { id: "maintenance", name: "Maintenance", icon: Wrench, color: "text-blue-600" },
    { id: "supplies", name: "Supplies", icon: Package, color: "text-green-600" },
    { id: "services", name: "Services", icon: Users, color: "text-purple-600" },
    { id: "property", name: "Property", icon: Building, color: "text-red-600" },
  ];

  // Subcategories for each category
  const subcategoriesMap = {
    utilities: ["Electricity", "Water", "Gas", "Internet", "Telephone"],
    maintenance: ["Plumbing", "Electrical", "HVAC", "Cleaning", "Repairs"],
    supplies: ["Cleaning", "Office", "Kitchen", "Medical", "Safety"],
    services: ["Security", "Housekeeping", "Laundry", "Catering", "Transport"],
    property: ["Rent", "Insurance", "Taxes", "Legal", "Registration"]
  };

  const paymentMethods = ["Cash", "Bank Transfer", "Cheque", "UPI", "Credit Card", "Debit Card"];

  const [customCategories, setCustomCategories] = useState([]);

  // Load expenses and stats on component mount
  useEffect(() => {
    loadExpenses();
    loadExpenseStats();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/expenses');
      setExpenses(response.expenses || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadExpenseStats = async () => {
    try {
      const response = await apiFetch('/expenses/stats');
      const statsData = response;
      setStats({
        total: statsData.total || 0,
        totalAmount: statsData.totalAmount || 0,
        paid: statsData.byStatus?.find(s => s._id === 'paid')?.count || 0,
        paidAmount: statsData.byStatus?.find(s => s._id === 'paid')?.total || 0,
        pending: statsData.byStatus?.find(s => s._id === 'pending')?.count || 0,
        pendingAmount: statsData.byStatus?.find(s => s._id === 'pending')?.total || 0,
        approved: statsData.byStatus?.find(s => s._id === 'approved')?.count || 0,
        approvedAmount: statsData.byStatus?.find(s => s._id === 'approved')?.total || 0
      });
    } catch (err) {
      console.error('Error loading expense stats:', err);
    }
  };

  // Get all categories (default + custom)
  const allCategories = [...defaultCategories, ...customCategories];

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }
    
    if (!formData.subcategory.trim()) {
      errors.subcategory = "Subcategory is required";
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "Valid amount is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.supplier.trim()) {
      errors.supplier = "Supplier is required";
    }
    
    if (!formData.date) {
      errors.date = "Expense date is required";
    }
    
    if (!formData.dueDate) {
      errors.dueDate = "Due date is required";
    } else if (new Date(formData.dueDate) < new Date(formData.date)) {
      errors.dueDate = "Due date cannot be earlier than expense date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData(prev => ({
        ...prev,
        subcategory: ""
      }));
    }
  };

  // Handle form submission
  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        paymentMethod: formData.paymentMethod.toLowerCase().replace(' ', '_')
      };

      await apiFetch('/expenses', {
        method: 'POST',
        body: expenseData
      });
      
      // Reload expenses and stats
      loadExpenses();
      loadExpenseStats();
      
      // Reset form
      setFormData({
        category: "",
        subcategory: "",
        amount: "",
        description: "",
        supplier: "",
        paymentMethod: "Bank Transfer",
        date: "",
        dueDate: "",
        status: "pending"
      });

      setShowAddModal(false);
      alert("Expense added successfully!");

    } catch (error) {
      console.error("Error adding expense:", error);
      alert(error.message || "Error adding expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset and close modal
  const handleCloseModal = () => {
    setFormData({
      category: "",
      subcategory: "",
      amount: "",
      description: "",
      supplier: "",
      paymentMethod: "Bank Transfer",
      date: "",
      dueDate: "",
      status: "Pending"
    });
    setFormErrors({});
    setShowAddModal(false);
  };

  // Filter expenses (client-side filtering for additional local filtering)
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expense.supplier || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expense.subcategory || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || expense.category === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "All" || expense.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return allCategories.find(cat => cat.id === categoryId) || 
           { name: categoryId, icon: FileText, color: "text-muted-foreground" };
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      "paid": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
      "pending": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
      "approved": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
      "cancelled": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400"
    };
    return styles[status] || "bg-muted text-muted-foreground border-border";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "paid": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Update expense status
  const updateExpenseStatus = async (expenseId, newStatus) => {
    try {
      await apiFetch(`/expenses/${expenseId}`, {
        method: 'PUT',
        body: { status: newStatus.toLowerCase() }
      });
      // Reload expenses and stats
      loadExpenses();
      loadExpenseStats();
    } catch (err) {
      console.error('Error updating expense status:', err);
      alert(err.message || 'Failed to update expense status');
    }
  };

  // Export functions
  const exportToCSV = () => {
    const csvData = filteredExpenses.map(expense => ({
      ID: expense._id,
      Category: getCategoryInfo(expense.category).name,
      Subcategory: expense.subcategory || 'N/A',
      Amount: expense.amount,
      Description: expense.description,
      Supplier: expense.supplier || 'N/A',
      'Payment Method': expense.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A',
      Date: expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A',
      'Due Date': expense.dueDate ? new Date(expense.dueDate).toLocaleDateString() : 'N/A',
      Status: expense.status?.toUpperCase() || 'N/A',
      'Created At': expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : 'N/A'
    }));
    
    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    console.log("Exporting PDF for expenses:", filteredExpenses);
    alert("PDF export started! Check your downloads folder.");
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-full mx-auto space-y-6 p-4 sm:p-6">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col space-y-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-foreground">Expenses Management</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {stats.overdue} Overdue
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Track and manage all hostel expenses and payments
            </p>
          </div>
          
          {/* Mobile Responsive Button Group */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={exportToCSV}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={exportToPDF}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards - Fixed Grid Layout with proper spacing */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-medium text-muted-foreground truncate">Total Expenses</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground truncate">₹{stats.totalAmount.toLocaleString()}</p>
                </div>
                <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-medium text-muted-foreground truncate">Paid</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.paid}</p>
                  <p className="text-sm text-muted-foreground truncate">₹{stats.paidAmount.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-medium text-muted-foreground truncate">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground truncate">₹{stats.pendingAmount.toLocaleString()}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-sm font-medium text-muted-foreground truncate">Approved</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground truncate">₹{stats.approvedAmount.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters - Mobile Responsive */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                placeholder="Search by description, supplier, or category..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 sm:flex-none border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground text-sm"
                >
                  <option value="All">All Categories</option>
                  {allCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground text-sm"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Add New Expense</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitExpense} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground ${
                        formErrors.category ? 'border-red-500' : 'border-border'
                      }`}
                    >
                      <option value="">Select Category</option>
                      {allCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                    )}
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subcategory <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      disabled={!formData.category}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground disabled:opacity-50 ${
                        formErrors.subcategory ? 'border-red-500' : 'border-border'
                      }`}
                    >
                      <option value="">Select Subcategory</option>
                      {formData.category && subcategoriesMap[formData.category]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                    {formErrors.subcategory && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.subcategory}</p>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground ${
                        formErrors.amount ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="0.00"
                    />
                    {formErrors.amount && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                    >
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  {/* Expense Date */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Expense Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground ${
                        formErrors.date ? 'border-red-500' : 'border-border'
                      }`}
                    />
                    {formErrors.date && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                    )}
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground ${
                        formErrors.dueDate ? 'border-red-500' : 'border-border'
                      }`}
                    />
                    {formErrors.dueDate && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.dueDate}</p>
                    )}
                  </div>
                </div>

                {/* Supplier */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Supplier/Vendor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground ${
                      formErrors.supplier ? 'border-red-500' : 'border-border'
                    }`}
                    placeholder="Enter supplier or vendor name"
                  />
                  {formErrors.supplier && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.supplier}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground resize-none ${
                      formErrors.description ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Describe the expense details..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:w-auto px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Add Expense</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expenses Table - FIXED LAYOUT AND CONTAINER ISSUES */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="px-4 sm:px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Expense Records ({filteredExpenses.length})
            </h2>
          </div>

          {/* Mobile Card View for smaller screens */}
          <div className="block lg:hidden">
            <div className="p-4 space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground">Loading expenses...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : filteredExpenses.length > 0 ? filteredExpenses.map((expense) => {
                const categoryInfo = getCategoryInfo(expense.category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                  <div key={expense._id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CategoryIcon className={`h-5 w-5 ${categoryInfo.color} mr-2 flex-shrink-0`} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground">
                            {categoryInfo.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {expense.subcategory || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(expense.status)}`}>
                        {getStatusIcon(expense.status)}
                        <span className="ml-1">{expense.status?.toUpperCase() || 'N/A'}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-foreground font-medium">
                        {expense.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {expense.supplier || 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold text-foreground">
                          ₹{expense.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {expense.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-foreground">
                          {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {expense.dueDate ? new Date(expense.dueDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <select
                          value={expense.status}
                          onChange={(e) => updateExpenseStatus(expense._id, e.target.value)}
                          className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground"
                        >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      <div className="flex items-center space-x-2">
                        <button className="text-muted-foreground hover:text-blue-600 p-1" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-green-600 p-1" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                                                        <button className="text-muted-foreground hover:text-purple-600 p-1" title="Download Documents">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-red-600 p-1" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-center text-muted-foreground">No expenses found.</p>
              )}
            </div>
          </div>

          {/* Desktop Table View - COMPLETELY FIXED */}
          <div className="hidden lg:block">
            {/* Container with proper overflow handling */}
            <div className="w-full overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-muted-foreground">
                          Loading expenses...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : filteredExpenses.length > 0 ? filteredExpenses.map((expense) => {
                      const categoryInfo = getCategoryInfo(expense.category);
                      const CategoryIcon = categoryInfo.icon;
                      
                      return (
                        <tr key={expense._id} className="hover:bg-muted">
                          {/* Category Column */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CategoryIcon className={`h-5 w-5 ${categoryInfo.color} mr-3 flex-shrink-0`} />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-foreground">
                                  {categoryInfo.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {expense.subcategory || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {/* Description Column - flexible width */}
                          <td className="px-4 py-4">
                            <div className="max-w-xs">
                              <div className="text-sm text-foreground font-medium line-clamp-2">
                                {expense.description}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {expense.supplier || 'N/A'}
                              </div>
                            </div>
                          </td>
                          
                          {/* Amount Column */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">
                              ₹{expense.amount.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {expense.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}
                            </div>
                          </td>
                          
                          {/* Date Column */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">
                              {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Due: {expense.dueDate ? new Date(expense.dueDate).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          
                          {/* Status Column */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(expense.status)}`}>
                              {getStatusIcon(expense.status)}
                              <span className="ml-1">{expense.status?.toUpperCase() || 'N/A'}</span>
                            </div>
                          </td>
                          
                          {/* Actions Column - FIXED to be fully visible */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-2">
                              {/* Status Update Dropdown */}
                      <select
                        value={expense.status}
                        onChange={(e) => updateExpenseStatus(expense._id, e.target.value)}
                        className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center justify-center space-x-1">
                                <button className="text-muted-foreground hover:text-blue-600 p-1" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-muted-foreground hover:text-green-600 p-1" title="Edit">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-muted-foreground hover:text-purple-600 p-1" title="Download">
                                  <Download className="h-4 w-4" />
                                </button>
                                <button className="text-muted-foreground hover:text-red-600 p-1" title="Delete">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-muted-foreground">
                          {searchQuery || categoryFilter !== "All" || statusFilter !== "All" ? "No expenses found." : "No expenses available."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredExpenses.length === 0 && (
          <div className="p-12 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No expenses found</p>
            <p className="text-muted-foreground text-sm">Try adjusting your search criteria</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesManagement;