import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  Eye,
  MessageSquare,
  Settings,
  Mail,
  Phone,
  Tag,
  TrendingUp,
} from "lucide-react";
import apiFetch from '@/lib/apiClient';
import { useTranslation } from 'react-i18next';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Load tickets on component mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/tickets');
      setTickets(response.tickets || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const fullName = ticket.tenant ? `${ticket.tenant.firstName} ${ticket.tenant.lastName}` : '';
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.tenant?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.room?.number || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "All" || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await apiFetch(`/tickets/${ticketId}/status`, {
        method: 'PATCH',
        body: { status: newStatus }
      });
      // Reload tickets to get updated data
      loadTickets();
    } catch (err) {
      console.error('Error updating ticket status:', err);
      alert(err.message || 'Failed to update ticket status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-red-100 text-red-800 border-red-200",
      "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
    };
    return styles[status] || "bg-muted text-muted-foreground border-border";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      High: "bg-red-50 text-red-700 border-red-200",
      Medium: "bg-orange-50 text-orange-700 border-orange-200",
      Low: "bg-blue-50 text-blue-700 border-blue-200",
    };
  return styles[priority] || "bg-background text-foreground border-border";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "technical":
        return <Settings className="h-4 w-4" />;
      case "payment":
        return <TrendingUp className="h-4 w-4" />;
      case "maintenance":
        return <Settings className="h-4 w-4" />;
      case "complaint":
        return <MessageSquare className="h-4 w-4" />;
      case "security":
        return <Eye className="h-4 w-4" />;
      case "plumbing":
        return <Settings className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const ticketCounts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  const categories = [...new Set(tickets.map((t) => t.category))];
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('tickets.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('tickets.subtitle')}</p>
        </div>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Settings className="h-4 w-4 inline" />
            Ticket Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('tickets.stats.total', 'Total Tickets'), value: ticketCounts.total, icon: <AlertTriangle className="h-8 w-8 text-blue-600" /> },
          { label: t('tickets.stats.open', 'Open'), value: ticketCounts.open, icon: <AlertTriangle className="h-8 w-8 text-red-600" /> },
          { label: t('tickets.stats.inProgress', 'In Progress'), value: ticketCounts.inProgress, icon: <Clock className="h-8 w-8 text-yellow-600" /> },
          { label: t('tickets.stats.resolved', 'Resolved'), value: ticketCounts.resolved, icon: <CheckCircle className="h-8 w-8 text-green-600" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6 flex items-center gap-4">
            <div className="flex-shrink-0">{stat.icon}</div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-semibold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
  <div className="bg-card rounded-xl shadow-sm border border-border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-2">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-background text-foreground placeholder:text-muted-foreground"
            placeholder="Search by subject, user, or room..."
          />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-background text-foreground"
            >
              <option value="All">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-background text-foreground"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-background text-foreground"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets List */}
  <div className="bg-card rounded-xl shadow-sm border border-border overflow-x-auto">
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2 animate-pulse" />
              <p>{t('tickets.loading', 'Loading tickets...')}</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
              <p>{t('tickets.noTickets')}</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div key={ticket._id} className="p-4 md:p-6 hover:bg-muted transition-colors flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {getStatusIcon(ticket.status)}
                      <span className="ml-1">{ticket.status}</span>
                    </div>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-card text-foreground border border-border">
                      {getCategoryIcon(ticket.category)}
                      <span className="ml-1">{ticket.category}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    #{ticket._id.slice(-6)} - {ticket.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{ticket.tenant ? `${ticket.tenant.firstName} ${ticket.tenant.lastName}` : 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{ticket.tenant?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{ticket.tenant?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>{ticket.room?.number || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                    className="text-sm border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-muted rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-green-600 hover:bg-muted rounded-lg transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
