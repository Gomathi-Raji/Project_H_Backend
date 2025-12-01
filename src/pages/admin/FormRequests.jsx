import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Home,
  FileText,
  Clock,
  MessageSquare,
  Download,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import apiFetch from "@/lib/apiClient";

const FormRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formRequests, setFormRequests] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch form requests
  const fetchFormRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both vacating and exchange requests
      const [vacatingRes, exchangeRes] = await Promise.all([
        apiFetch("/vacating-requests"),
        apiFetch("/exchange-requests")
      ]);

      // Transform vacating requests
      const vacatingRequests = vacatingRes.requests.map(req => ({
        id: req._id,
        type: "Vacating",
        tenantName: `${req.tenant.firstName} ${req.tenant.lastName}`,
        tenantEmail: req.tenant.email,
        roomNumber: req.tenant.room?.number || "N/A",
        reason: req.reason,
        vacatingDate: new Date(req.vacatingDate).toLocaleDateString(),
        submittedDate: new Date(req.createdAt).toLocaleDateString(),
        status: req.status.charAt(0).toUpperCase() + req.status.slice(1),
        priority: "Medium", // Default priority
        additionalNotes: req.additionalNotes,
        approvedBy: req.approvedBy,
        approvedAt: req.approvedAt,
        documents: [] // No documents for now
      }));

      // Transform exchange requests
      const exchangeRequests = exchangeRes.requests.map(req => ({
        id: req._id,
        type: "Exchange",
        tenantName: `${req.tenant.firstName} ${req.tenant.lastName}`,
        tenantEmail: req.tenant.email,
        roomNumber: req.currentRoom?.number || req.currentRoom || "N/A",
        preferredRoom: req.desiredRoom?.number || req.desiredRoom || "N/A",
        reason: req.reason,
        submittedDate: new Date(req.createdAt).toLocaleDateString(),
        status: req.status.charAt(0).toUpperCase() + req.status.slice(1),
        priority: "Medium", // Default priority
        additionalNotes: req.additionalNotes,
        approvedBy: req.approvedBy,
        approvedAt: req.approvedAt,
        documents: [] // No documents for now
      }));

      // Combine and sort by creation date (newest first)
      const allRequests = [...vacatingRequests, ...exchangeRequests].sort(
        (a, b) => new Date(b.submittedDate) - new Date(a.submittedDate)
      );

      setFormRequests(allRequests);
    } catch (err) {
      setError(err.message || "Failed to fetch form requests");
      console.error("Form requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormRequests();
  }, []);

  // Filter requests
  const filteredRequests = formRequests.filter((request) => {
    const matchesSearch =
      request.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || request.status === statusFilter;
    const matchesType = typeFilter === "All" || request.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle approve/reject actions
  const handleRequestAction = async (requestId, action, type, reason = "") => {
    try {
      setActionLoading(requestId);

      const endpoint = type === "Vacating"
        ? `/vacating-requests/${requestId}/${action}`
        : `/exchange-requests/${requestId}/${action}`;

      const body = action === "reject" ? { reason } : {};

      await apiFetch(endpoint, {
        method: "PUT",
        body
      });

      // Refresh the requests
      await fetchFormRequests();
    } catch (err) {
      setError(`Failed to ${action} request: ${err.message}`);
      console.error(`Request ${action} error:`, err);
    } finally {
      setActionLoading(null);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
      Approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400",
      Rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400",
      Completed: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      High: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",
      Medium: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
      Low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
    };
  return styles[priority] || "bg-background text-foreground border-border";
  };

  // Get type icon and color
  const getTypeIcon = (type) => {
    return type === "Vacating" ? <Home className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  // Get counts
  const requestCounts = {
    total: formRequests.length,
    pending: formRequests.filter((r) => r.status === "Pending").length,
    approved: formRequests.filter((r) => r.status === "Approved").length,
    rejected: formRequests.filter((r) => r.status === "Rejected").length,
    vacating: formRequests.filter((r) => r.type === "Vacating").length,
    exchange: formRequests.filter((r) => r.type === "Exchange").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Form Requests</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage tenant vacating and room exchange requests
          </p>
        </div>
        <button
          onClick={fetchFormRequests}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries({
          Total: requestCounts.total,
          Pending: requestCounts.pending,
          Approved: requestCounts.approved,
          Rejected: requestCounts.rejected,
          Vacating: requestCounts.vacating,
          Exchange: requestCounts.exchange,
        }).map(([key, value], idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              {key === "Total" && <ClipboardList className="h-6 w-6 text-blue-600" />}
              {key === "Pending" && <Clock className="h-6 w-6 text-yellow-600" />}
              {key === "Approved" && <CheckCircle className="h-6 w-6 text-green-600" />}
              {key === "Rejected" && <XCircle className="h-6 w-6 text-red-600" />}
              {key === "Vacating" && <Home className="h-6 w-6 text-purple-600" />}
              {key === "Exchange" && <FileText className="h-6 w-6 text-indigo-600" />}
              <div className="ml-3 text-sm">
                <p className="text-gray-500 dark:text-gray-400">{key}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Search by tenant, room, reason..."
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Vacating">Vacating</option>
              <option value="Exchange">Exchange</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Form Requests ({filteredRequests.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                {/* Header badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <div
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      request.type === "Vacating"
                        ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400"
                    }`}
                  >
                    {getTypeIcon(request.type)}
                    <span className="ml-1">{request.type}</span>
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(
                      request.priority
                    )}`}
                  >
                    {request.priority} Priority
                  </div>
                </div>

                {/* Details */}
                <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {request.type} Request #{request.id.slice(-6)}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Reason:</strong> {request.reason}
                </p>

                {/* Tenant & Room */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span className="font-medium">{request.tenantName}</span>
                    <span className="mx-1 hidden sm:inline">•</span>
                    <span>{request.tenantEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    <span>Room: <strong>{request.roomNumber}</strong></span>
                    {request.preferredRoom && (
                      <>
                        <span className="mx-1">→</span>
                        <span>Preferred: <strong>{request.preferredRoom}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Submitted: {request.submittedDate}</span>
                  </div>
                  {request.vacatingDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Vacating: {request.vacatingDate}</span>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                {request.additionalNotes && (
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <strong>Notes:</strong> {request.additionalNotes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                {request.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestAction(request.id, "approve", request.type)}
                      disabled={actionLoading === request.id}
                      className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === request.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
                      ) : (
                        <Check className="h-3 w-3 mr-1" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason) {
                          handleRequestAction(request.id, "reject", request.type, reason);
                        }
                      }}
                      disabled={actionLoading === request.id}
                      className="flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === request.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      Reject
                    </button>
                  </div>
                )}

                <div className="flex gap-1 sm:flex-col">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Details">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Send Message">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="p-6 text-center">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm sm:text-lg">No form requests found</p>
            <p className="text-gray-400 text-xs sm:text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormRequests;
