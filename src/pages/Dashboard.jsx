import React, { useState, useEffect } from "react";
import {
  Calendar,
  Home,
  AlertCircle,
  Download,
  ChevronDown,
  ChevronUp,
  Lock,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import apiFetch from "@/lib/apiClient";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    userName: "",
    currentRent: 0,
    dueDate: null,
    activeIssues: 0,
    roomNumber: null,
    recentInvoices: [],
    activeTickets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllInvoices, setShowAllInvoices] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/tenants/dashboard/my-info");
      setDashboardData(data || {});
    } catch (err) {
      setError(err?.message || "Failed to load dashboard data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);
    } catch (e) {
      return amount;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const displayedInvoices = showAllInvoices ? dashboardData.recentInvoices : (dashboardData.recentInvoices || []).slice(0, 3);
  const isInvoicePaid = (invoice) => invoice?.status?.toLowerCase() === "completed";

  const handleDownload = (invoice) => {
    if (isInvoicePaid(invoice)) {
      // placeholder: implement real download
      alert(`Downloading invoice for ${formatDate(invoice.paidAt)}`);
    } else {
      alert("Cannot download invoice. Payment is required first.");
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case "completed":
        return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case "pending":
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case "failed":
        return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      case "in_progress":
        return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
      default:
        return `${base} bg-muted text-muted-foreground`;
    }
  };

  const getPriorityBadge = (priority) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority?.toLowerCase()) {
      case "high":
        return `${base} bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800`;
      case "medium":
        return `${base} bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800`;
      case "low":
        return `${base} bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800`;
      default:
        return `${base} bg-background text-foreground border border-border`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg border border-border">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-6 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">Error loading dashboard</h3>
              <div className="mt-2 text-sm text-destructive/80">{error}</div>
              <button onClick={fetchDashboardData} className="mt-2 px-3 py-1 bg-destructive text-destructive-foreground text-sm rounded hover:bg-destructive/90">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome Back, {dashboardData.userName || "User"}!</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your hostel account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Current Rent</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(dashboardData.currentRent)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Due Date</p>
              <p className="text-2xl font-bold text-foreground">{dashboardData.dueDate ? formatDate(dashboardData.dueDate) : "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active Issues</p>
              <p className="text-2xl font-bold text-foreground">{dashboardData.activeIssues}</p>
            </div>
          </div>
        </div>

        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Room Number</p>
              <p className="text-2xl font-bold text-foreground">{dashboardData.roomNumber || "Not assigned"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card shadow-sm rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Recent Invoices</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {displayedInvoices && displayedInvoices.length > 0 ? (
                displayedInvoices.map((invoice, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-background rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{invoice.type === "rent" ? "Monthly Rent" : invoice.type}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(invoice.amount)}</p>
                      {invoice.paidAt && <p className="text-xs text-muted-foreground mt-1">Paid on: {formatDate(invoice.paidAt)}</p>}
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={getStatusBadge(invoice.status)}>{invoice.status}</span>
                      {isInvoicePaid(invoice) ? (
                        <button onClick={() => handleDownload(invoice)} className="p-2 rounded-lg transition-all duration-200" title="Download invoice">
                          <Download className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <button disabled className="text-muted-foreground cursor-not-allowed p-2 rounded-lg" title="Payment required to download">
                            <Lock className="h-4 w-4" />
                          </button>
                          <span className="text-xs text-muted-foreground">Payment Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent invoices</p>
              )}

              {dashboardData.recentInvoices && dashboardData.recentInvoices.length > 3 && (
                <div className="mt-4 text-center">
                  <button onClick={() => setShowAllInvoices(!showAllInvoices)} className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-background hover:bg-muted rounded-lg transition-colors duration-200">
                    {showAllInvoices ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span>Show More ({dashboardData.recentInvoices.length - 3} more)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card shadow-sm rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Active Tickets</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.activeTickets && dashboardData.activeTickets.length > 0 ? (
                dashboardData.activeTickets.map((ticket) => (
                  <div key={ticket._id} className="p-4 bg-background rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-foreground">{ticket.title}</h3>
                      <div className="flex space-x-2">
                        <span className={getStatusBadge(ticket.status)}>{ticket.status}</span>
                        <span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Created: {formatDate(ticket.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No active tickets</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
