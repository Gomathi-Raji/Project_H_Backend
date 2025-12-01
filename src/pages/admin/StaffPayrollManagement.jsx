import React, { useState } from "react";
import {
  UserCheck,
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
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Camera,
  Calculator,
  CreditCard,
  Activity,
  User,
  Settings,
  Star,
  Shield,
  Home,
  Briefcase,
  X,
  Save,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const StaffPayrollManagement = () => {
  const [activeTab, setActiveTab] = useState("staff");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [expandedPayrollCard, setExpandedPayrollCard] = useState(null);

  // Add Staff Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    photo: null,
    joiningDate: "",
    salary: "",
    status: "Active",
    address: "",
    emergencyContact: "",
    bankAccount: "",
    ifscCode: "",
    pfNumber: "",
    esiNumber: "",
    aadhaar: "",
    shifts: "Day Shift",
    experience: "",
    qualification: "",
    bloodGroup: "",
    maritalStatus: "Single"
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Staff data
  const [staffMembers, setStaffMembers] = useState([]);

  // Payroll data
  const [payrollRecords, setPayrollRecords] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: "Rajesh Kumar",
      month: "January 2024",
      basicSalary: 18000,
      workingDays: 31,
      presentDays: 29,
      leaves: 2,
      overtime: 4,
      overtimeRate: 100,
      allowances: {
        hra: 3600,
        transport: 1000,
        medical: 500,
        special: 800
      },
      deductions: {
        pf: 2160,
        esi: 324,
        tax: 0,
        advance: 500
      },
      bonus: 1000,
      grossSalary: 25900,
      totalDeductions: 2984,
      netSalary: 22916,
      status: "Processed",
      processedDate: "2024-01-31",
      processedBy: "HR Admin",
      paidDate: null,
      paymentMethod: "Bank Transfer",
      notes: "Regular monthly salary"
    },
    {
      id: 2,
      staffId: 2,
      staffName: "Priya Sharma",
      month: "January 2024",
      basicSalary: 15000,
      workingDays: 31,
      presentDays: 28,
      leaves: 3,
      overtime: 2,
      overtimeRate: 80,
      allowances: {
        hra: 3000,
        transport: 1000,
        medical: 500,
        special: 0
      },
      deductions: {
        pf: 1800,
        esi: 270,
        tax: 0,
        advance: 0
      },
      bonus: 500,
      grossSalary: 20160,
      totalDeductions: 2070,
      netSalary: 18090,
      status: "Pending",
      processedDate: "2024-01-31",
      processedBy: "HR Admin",
      paidDate: null,
      paymentMethod: "Bank Transfer",
      notes: "Pending approval"
    },
    {
      id: 3,
      staffId: 4,
      staffName: "Sunita Devi",
      month: "January 2024",
      basicSalary: 19000,
      workingDays: 31,
      presentDays: 30,
      leaves: 1,
      overtime: 6,
      overtimeRate: 120,
      allowances: {
        hra: 3800,
        transport: 1000,
        medical: 500,
        special: 1200
      },
      deductions: {
        pf: 2280,
        esi: 342,
        tax: 0,
        advance: 1000
      },
      bonus: 1500,
      grossSalary: 27220,
      totalDeductions: 3622,
      netSalary: 23598,
      status: "Paid",
      processedDate: "2024-01-31",
      processedBy: "HR Admin",
      paidDate: "2024-02-01",
      paymentMethod: "Bank Transfer",
      notes: "Payment completed"
    },
    {
      id: 4,
      staffId: 3,
      staffName: "Mohammed Ali",
      month: "January 2024",
      basicSalary: 22000,
      workingDays: 31,
      presentDays: 27,
      leaves: 4,
      overtime: 8,
      overtimeRate: 150,
      allowances: {
        hra: 4400,
        transport: 1200,
        medical: 500,
        special: 2000
      },
      deductions: {
        pf: 2640,
        esi: 396,
        tax: 200,
        advance: 2000
      },
      bonus: 2000,
      grossSalary: 31300,
      totalDeductions: 5236,
      netSalary: 26064,
      status: "Processed",
      processedDate: "2024-01-31",
      processedBy: "HR Admin",
      paidDate: null,
      paymentMethod: "Bank Transfer",
      notes: "Ready for payment"
    }
  ]);

  // Departments
  const departments = ["All", "Security", "Maintenance", "Kitchen", "Administration", "Management"];
  const roles = ["Security Guard", "House Keeper", "Maintenance Engineer", "Head Cook", "Assistant Cook", "Receptionist", "Manager"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.role.trim()) errors.role = "Role is required";
    if (!formData.phone.trim()) errors.phone = "Contact number is required";
    if (!formData.joiningDate.trim()) errors.joiningDate = "Joining date is required";
    if (!formData.salary.trim()) errors.salary = "Salary is required";

    // Email validation
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Phone validation
    if (formData.phone.trim() && !/^[+]?[\d\s-()]{10,}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number format";
    }

    // Salary validation
    if (formData.salary && isNaN(formData.salary)) {
      errors.salary = "Salary must be a number";
    }

    // Aadhaar validation
    if (formData.aadhaar.trim() && !/^\d{4}-\d{4}-\d{4}$/.test(formData.aadhaar)) {
      errors.aadhaar = "Aadhaar format should be XXXX-XXXX-XXXX";
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
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      photo: null,
      joiningDate: "",
      salary: "",
      status: "Active",
      address: "",
      emergencyContact: "",
      bankAccount: "",
      ifscCode: "",
      pfNumber: "",
      esiNumber: "",
      aadhaar: "",
      shifts: "Day Shift",
      experience: "",
      qualification: "",
      bloodGroup: "",
      maritalStatus: "Single"
    });
    setFormErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newStaff = {
        ...formData,
        id: staffMembers.length + 1,
        salary: parseInt(formData.salary),
        attendanceRate: 100,
        lastLogin: new Date().toISOString().split('T')[0]
      };
      
      setStaffMembers(prev => [...prev, newStaff]);
      setShowAddStaffModal(false);
      resetForm();
      setIsSubmitting(false);
      
      alert("Staff member added successfully!");
    }, 1000);
  };

  // Filter staff
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "All" || staff.department === departmentFilter;
    const matchesStatus = statusFilter === "All" || staff.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Filter payroll
  const filteredPayroll = payrollRecords.filter(record => {
    const matchesSearch = 
      record.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.month.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      "Active": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
      "Inactive": "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
      "Processed": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Paid": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400"
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Get department icon
  const getDepartmentIcon = (department) => {
    switch(department) {
      case "Security": return <Shield className="h-4 w-4" />;
      case "Maintenance": return <Settings className="h-4 w-4" />;
      case "Kitchen": return <Home className="h-4 w-4" />;
      case "Administration": return <Briefcase className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  // Update staff status
  const updateStaffStatus = (staffId, newStatus) => {
    setStaffMembers(prevStaff =>
      prevStaff.map(staff =>
        staff.id === staffId ? { ...staff, status: newStatus } : staff
      )
    );
  };

  // Update payroll status
  const updatePayrollStatus = (recordId, newStatus) => {
    setPayrollRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === recordId ? { 
          ...record, 
          status: newStatus,
          paidDate: newStatus === "Paid" ? new Date().toISOString().split('T')[0] : null
        } : record
      )
    );
  };

  // Delete staff member
  const deleteStaff = (staffId) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setStaffMembers(prevStaff => prevStaff.filter(staff => staff.id !== staffId));
    }
  };

  // Toggle payroll card expansion
  const togglePayrollCard = (recordId) => {
    setExpandedPayrollCard(expandedPayrollCard === recordId ? null : recordId);
  };

  // Calculate payroll statistics
  const payrollStats = {
    totalStaff: staffMembers.filter(s => s.status === "Active").length,
    totalSalary: payrollRecords.reduce((sum, record) => sum + record.netSalary, 0),
    processed: payrollRecords.filter(r => r.status === "Processed").length,
    pending: payrollRecords.filter(r => r.status === "Pending").length,
    paid: payrollRecords.filter(r => r.status === "Paid").length
  };

  // Staff statistics
  const staffStats = {
    total: staffMembers.length,
    active: staffMembers.filter(s => s.status === "Active").length,
    inactive: staffMembers.filter(s => s.status === "Inactive").length,
    avgAttendance: Math.round(staffMembers.reduce((sum, staff) => sum + staff.attendanceRate, 0) / staffMembers.length),
    totalSalaryBudget: staffMembers.filter(s => s.status === "Active").reduce((sum, staff) => sum + staff.salary, 0)
  };

  // Export functions
  const exportStaffData = () => {
    console.log("Exporting staff data:", filteredStaff);
    alert("Staff data exported successfully!");
  };

  const exportPayrollData = () => {
    console.log("Exporting payroll data:", filteredPayroll);
    alert("Payroll data exported successfully!");
  };

  const generateSalarySlip = (recordId) => {
    const record = payrollRecords.find(r => r.id === recordId);
    console.log("Generating salary slip for:", record);
    alert(`Salary slip generated for ${record.staffName}`);
  };

  const processPayroll = () => {
    console.log("Processing payroll for all pending records");
    alert("Payroll processing initiated!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff & Payroll Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage staff profiles, attendance, and payroll processing
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={exportStaffData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("staff")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "staff"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Staff Management</span>
          </button>
          <button
            onClick={() => setActiveTab("payroll")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === "payroll"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Payroll Management</span>
          </button>
        </nav>
      </div>

      {/* Staff Management Tab */}
      {activeTab === "staff" && (
        <>
          {/* Staff Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{staffStats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-600">{staffStats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">{staffStats.inactive}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Attendance</p>
                  <p className="text-2xl font-bold text-blue-600">{staffStats.avgAttendance}%</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Budget</p>
                  <p className="text-2xl font-bold text-purple-600">₹{staffStats.totalSalaryBudget.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Staff Actions & Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Search staff by name, role, or email..."
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white text-sm"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Staff Grid/Cards View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Card Header */}
                <div className="relative p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {staff.photo ? (
                          <img src={staff.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{staff.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: {staff.id}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(staff.status)}`}>
                      {staff.status}
                    </span>
                  </div>

                  {/* Role & Department */}
                  <div className="flex items-center space-x-2 mb-3">
                    {getDepartmentIcon(staff.department)}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{staff.role}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">• {staff.department}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{staff.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">{staff.email}</span>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{staff.salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{staff.attendanceRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{staff.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Shift</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{staff.shifts}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <select
                      value={staff.status}
                      onChange={(e) => updateStaffStatus(staff.id, e.target.value)}
                      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-blue-600 p-1" title="View Profile">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-green-600 p-1" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-purple-600 p-1" title="Generate Salary Slip">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteStaff(staff.id)}
                        className="text-gray-400 hover:text-red-600 p-1" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State for Staff */}
          {filteredStaff.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No staff members found</p>
              <p className="text-gray-400 text-sm mb-6">Try adjusting your search criteria or add new staff members</p>
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Staff Member</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Payroll Management Tab */}
      {activeTab === "payroll" && (
        <>
          {/* Payroll Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Total Payroll</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">₹{payrollStats.totalSalary.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
                </div>
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Processed</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">{payrollStats.processed}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ready for payment</p>
                </div>
                <Calculator className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-lg md:text-2xl font-bold text-yellow-600">{payrollStats.pending}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting approval</p>
                </div>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Paid</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">{payrollStats.paid}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                </div>
                <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Payroll Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Search payroll records..."
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 md:gap-4">
                <button
                  onClick={exportPayrollData}
                  className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm md:text-base">Export</span>
                </button>
                <button
                  onClick={processPayroll}
                  className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calculator className="h-4 w-4" />
                  <span className="text-sm md:text-base">Process</span>
                </button>
                <button
                  onClick={() => setShowPayrollModal(true)}
                  className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm md:text-base">Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Payroll Cards */}
          <div className="space-y-4 md:space-y-6">
            {filteredPayroll.map((record) => (
              <div key={record.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Card Header - Mobile Optimized */}
                <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                      <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">{record.staffName}</h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">ID: {record.staffId} • {record.month}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                      <div className="text-right">
                        <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white">₹{record.netSalary.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Net Salary</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Summary - Always Visible */}
                <div className="px-4 md:px-6 py-3 bg-gray-25 dark:bg-gray-800/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center md:text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Days Present</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">{record.presentDays}/{record.workingDays}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Gross Salary</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">₹{record.grossSalary.toLocaleString()}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Deductions</p>
                      <p className="text-sm md:text-base font-semibold text-red-600">₹{record.totalDeductions.toLocaleString()}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Overtime</p>
                      <p className="text-sm md:text-base font-semibold text-green-600">{record.overtime}h</p>
                    </div>
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <div className="px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => togglePayrollCard(record.id)}
                    className="w-full flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>{expandedPayrollCard === record.id ? 'Hide Details' : 'View Details'}</span>
                    {expandedPayrollCard === record.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Detailed Information - Collapsible */}
                {expandedPayrollCard === record.id && (
                  <div className="px-4 md:px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Attendance & Basic Info */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Attendance Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Working Days</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{record.workingDays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Present Days</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{record.presentDays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Leaves</span>
                            <span className="text-sm font-medium text-red-600">{record.leaves}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Overtime (hrs)</span>
                            <span className="text-sm font-medium text-green-600">{record.overtime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">OT Rate</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">₹{record.overtimeRate}/hr</span>
                          </div>
                        </div>
                      </div>

                      {/* Earnings */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Earnings</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Basic Salary</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">₹{record.basicSalary.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">HRA</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">₹{record.allowances.hra.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Transport</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">₹{record.allowances.transport.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Medical</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">₹{record.allowances.medical.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Special Allowance</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">₹{record.allowances.special.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Overtime</span>
                            <span className="text-sm font-medium text-green-600">₹{(record.overtime * record.overtimeRate).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Bonus</span>
                            <span className="text-sm font-medium text-green-600">₹{record.bonus.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Gross Salary</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">₹{record.grossSalary.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Deductions</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">PF</span>
                            <span className="text-sm font-medium text-red-600">₹{record.deductions.pf.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">ESI</span>
                            <span className="text-sm font-medium text-red-600">₹{record.deductions.esi.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tax</span>
                            <span className="text-sm font-medium text-red-600">₹{record.deductions.tax.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Advance</span>
                            <span className="text-sm font-medium text-red-600">₹{record.deductions.advance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Total Deductions</span>
                            <span className="text-sm font-bold text-red-600">₹{record.totalDeductions.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 bg-green-50 dark:bg-green-900/20 -mx-2 px-2 py-2 rounded">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">Net Salary</span>
                            <span className="text-sm font-bold text-green-600">₹{record.netSalary.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Processed Date:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{record.processedDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Processed By:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{record.processedBy}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{record.paymentMethod}</span>
                        </div>
                      </div>
                      {record.notes && (
                        <div className="mt-2">
                          <span className="text-gray-500 dark:text-gray-400">Notes:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{record.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions - Mobile Optimized */}
                <div className="px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between space-y-3 md:space-y-0">
                    <select
                      value={record.status}
                      onChange={(e) => updatePayrollStatus(record.id, e.target.value)}
                      className="w-full md:w-auto text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Processed">Processed</option>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                    
                    <div className="grid grid-cols-4 md:flex md:items-center gap-2 md:space-x-3">
                      <button className="flex items-center justify-center text-gray-400 hover:text-blue-600 p-2 border border-gray-200 dark:border-gray-600 rounded-lg" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => generateSalarySlip(record.id)}
                        className="flex items-center justify-center text-gray-400 hover:text-green-600 p-2 border border-gray-200 dark:border-gray-600 rounded-lg" 
                        title="Download Salary Slip"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="flex items-center justify-center text-gray-400 hover:text-purple-600 p-2 border border-gray-200 dark:border-gray-600 rounded-lg" title="Initiate Payment">
                        <CreditCard className="h-4 w-4" />
                      </button>
                      <button className="flex items-center justify-center text-gray-400 hover:text-orange-600 p-2 border border-gray-200 dark:border-gray-600 rounded-lg" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State for Payroll */}
          {filteredPayroll.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No payroll records found</p>
              <p className="text-gray-400 text-sm mb-6">Try adjusting your search criteria or process new payroll</p>
              <button
                onClick={processPayroll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Calculator className="h-4 w-4" />
                <span>Process Payroll</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Staff Modal - Enhanced with Full Form */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Add New Staff Member</span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fill in the information to register a new staff member</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddStaffModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Personal Information</span>
                    <span className="text-red-500">*</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Photo Upload */}
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Photo
                      </label>
                      <div className="flex flex-col items-center">
                        <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                          {formData.photo ? (
                            <img src={formData.photo} alt="Preview" className="h-24 w-24 object-cover" />
                          ) : (
                            <Camera className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          Upload Photo
                        </label>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter full name"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{formErrors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors ${
                          formErrors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      {formErrors.role && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{formErrors.role}</span>
                        </p>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Department
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                      >
                        <option value="">Select Department</option>
                        {departments.filter(dept => dept !== "All").map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Work Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span>Contact Information</span>
                    <span className="text-red-500">*</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="+91 9876543210"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="name@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="Complete address"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <span>Employment Details</span>
                    <span className="text-red-500">*</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Joining Date */}
                    <div>
                      <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Joining Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="joiningDate"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors ${
                          formErrors.joiningDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {formErrors.joiningDate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{formErrors.joiningDate}</span>
                        </p>
                      )}
                    </div>

                    {/* Salary */}
                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Monthly Salary (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors ${
                          formErrors.salary ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="15000"
                        min="0"
                      />
                      {formErrors.salary && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{formErrors.salary}</span>
                        </p>
                      )}
                    </div>

                    {/* Shifts */}
                    <div>
                      <label htmlFor="shifts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Work Shift
                      </label>
                      <select
                        id="shifts"
                        name="shifts"
                        value={formData.shifts}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                      >
                        <option value="Day Shift">Day Shift</option>
                        <option value="Night Shift">Night Shift</option>
                        <option value="Rotational">Rotational</option>
                      </select>
                    </div>

                    {/* Experience */}
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Experience
                      </label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="5 years"
                      />
                    </div>

                    {/* Qualification */}
                    <div>
                      <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Qualification
                      </label>
                      <input
                        type="text"
                        id="qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="12th Pass, Graduate, etc."
                      />
                    </div>

                    {/* Marital Status */}
                    <div>
                      <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Marital Status
                      </label>
                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bank & Official Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                    <span>Bank & Official Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Bank Account */}
                    <div>
                      <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        id="bankAccount"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="1234567890"
                      />
                    </div>

                    {/* IFSC Code */}
                    <div>
                      <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        id="ifscCode"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="HDFC0001234"
                      />
                    </div>

                    {/* PF Number */}
                    <div>
                      <label htmlFor="pfNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        PF Number
                      </label>
                      <input
                        type="text"
                        id="pfNumber"
                        name="pfNumber"
                        value={formData.pfNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="PF123456789"
                      />
                    </div>

                    {/* ESI Number */}
                    <div>
                      <label htmlFor="esiNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ESI Number
                      </label>
                      <input
                        type="text"
                        id="esiNumber"
                        name="esiNumber"
                        value={formData.esiNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="ESI987654321"
                      />
                    </div>

                    {/* Aadhaar */}
                    <div>
                      <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Aadhaar Number
                      </label>
                      <input
                        type="text"
                        id="aadhaar"
                        name="aadhaar"
                        value={formData.aadhaar}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors ${
                          formErrors.aadhaar ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="1234-5678-9012"
                      />
                      {formErrors.aadhaar && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{formErrors.aadhaar}</span>
                        </p>
                      )}
                    </div>

                    {/* Blood Group */}
                    <div>
                      <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Blood Group
                      </label>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white transition-colors"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddStaffModal(false);
                      resetForm();
                    }}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding Staff...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Add Staff Member</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Modal Placeholder */}
      {showPayrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Payroll Record</h2>
                <button
                  onClick={() => setShowPayrollModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Payroll processing form would be implemented here with salary calculations.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPayrollModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Process Payroll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPayrollManagement;