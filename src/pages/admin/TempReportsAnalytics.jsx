import React, { useState } from "react";
import { Download, FileText, BarChart3, Users, DollarSign, Home, TrendingUp, Activity } from "lucide-react";

const ReportsAnalytics = () => {
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data
  const keyMetrics = { totalTenants: 0, occupancyRate: 0, monthlyRevenue: 0 };
  const recentActivity = { newTenants: 0, paymentsReceived: 0 };
  const analyticsCards = [
    { title: "Payment Data", description: "Detailed payment analytics and trends", icon: DollarSign, color: "text-primary" },
    { title: "Full Report", description: "Comprehensive hostel management report", icon: FileText, color: "text-accent" },
    { title: "Advanced Analytics", description: "Deep insights and performance metrics", icon: BarChart3, color: "text-secondary" }
  ];
  const reportTypes = [
    { value: "overview", label: "Overview Report" },
    { value: "financial", label: "Financial Report" },
    { value: "occupancy", label: "Occupancy Report" },
    { value: "tenant-activity", label: "Tenant Activity" },
    { value: "tenant-data", label: "Tenant Data" }
  ];

  const handleExport = (format) => console.log(`Exporting ${selectedReport} report as ${format}`);

  return (
  <div className="p-4 md:p-6 bg-background min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Reports & Analytics</h1>
  <p className="text-sm md:text-base text-muted-foreground">Generate and export comprehensive reports</p>
      </div>

      {/* Report Selection */}
  <div className="bg-card rounded-lg border border-border shadow p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 md:mt-0">
            <button onClick={() => handleExport("csv")} className="flex-1 sm:flex-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={() => handleExport("pdf")} className="flex-1 sm:flex-auto flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4" /> Export PDF
            </button>
            <button onClick={() => handleExport("json")} className="flex-1 sm:flex-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <Download className="h-4 w-4" /> Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {analyticsCards.map((card, idx) => (
          <div key={idx} className="bg-card rounded-lg border border-border shadow p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`h-6 w-6 ${card.color}`} />
              <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Key Metrics & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Key Metrics */}
        <div className="bg-card rounded-lg border border-border shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3"><Users className="h-5 w-5 text-blue-600" /><div><p className="text-sm font-medium text-foreground">Total Tenants</p><p className="text-xs text-muted-foreground">Active residents</p></div></div>
              <span className="text-xl font-bold text-blue-600">{keyMetrics.totalTenants}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3"><Home className="h-5 w-5 text-green-600" /><div><p className="text-sm font-medium text-foreground">Occupancy Rate</p><p className="text-xs text-muted-foreground">Current occupancy</p></div></div>
              <span className="text-xl font-bold text-green-600">{keyMetrics.occupancyRate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3"><DollarSign className="h-5 w-5 text-purple-600" /><div><p className="text-sm font-medium text-foreground">Monthly Revenue</p><p className="text-xs text-muted-foreground">Current month</p></div></div>
              <span className="text-xl font-bold text-purple-600">₹{keyMetrics.monthlyRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-lg border border-border shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-blue-600" /><div><p className="text-sm font-medium text-foreground">New Tenants</p><p className="text-xs text-muted-foreground">This month</p></div></div>
              <span className="text-xl font-bold text-blue-600">{recentActivity.newTenants}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3"><Activity className="h-5 w-5 text-green-600" /><div><p className="text-sm font-medium text-foreground">Payments Received</p><p className="text-xs text-muted-foreground">This month</p></div></div>
              <span className="text-xl font-bold text-green-600">{recentActivity.paymentsReceived}</span>
            </div>

            {/* Quick Insights */}
            <div className="border-t border-border pt-3">
              <h3 className="text-sm font-medium text-foreground mb-2">Quick Insights</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Revenue Growth</span><span className="text-blue-600 font-medium">0%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Occupancy Change</span><span className="text-blue-600 font-medium">0%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment Collection</span><span className="text-blue-600 font-medium">0%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-card rounded-lg border border-border shadow p-4 md:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Report Preview</h2>
        <div className="bg-background/30 rounded-lg p-6 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">{reportTypes.find(type => type.value === selectedReport)?.label} will be generated here</p>
          <p className="text-xs text-muted-foreground">Select a report type and click export to generate your report</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
