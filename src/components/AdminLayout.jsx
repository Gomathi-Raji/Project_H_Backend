import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Search,
  Bell,
  User,
  ChevronDown,
  ClipboardList,
  Receipt,
  UserCheck,
  Mic,
  MicOff,
  MessageCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";
import apiFetch, { setToken } from "@/lib/apiClient";
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const AdminLayout = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Mock counts - in real app, these would come from API/state
  const pendingTicketsCount = 0;
  const pendingFormsCount = 0;
  const overdueExpensesCount = 0;
  const pendingPayrollCount = 0;

  const { t } = useTranslation();

  const menuItems = [
    { path: "/admin/dashboard", label: "admin.menu.dashboard", icon: LayoutDashboard },
    { path: "/admin/tenant-management", label: "admin.menu.tenantManagement", icon: Users },
    { path: "/admin/payment-tracking", label: "admin.menu.paymentTracking", icon: CreditCard },
    { 
      path: "/admin/tickets", 
      label: "admin.menu.tickets", 
      icon: AlertTriangle, 
      badge: pendingTicketsCount > 0 ? pendingTicketsCount : null 
    },
    { 
      path: "/admin/form-requests", 
      label: "admin.menu.formRequests", 
      icon: ClipboardList, 
      badge: pendingFormsCount > 0 ? pendingFormsCount : null 
    },
    { 
      path: "/admin/expenses", 
      label: "admin.menu.expensesManagement", 
      isMultiline: true,
      icon: Receipt, 
      badge: overdueExpensesCount > 0 ? overdueExpensesCount : null 
    },
    { 
      path: "/admin/staff-payroll", 
      label: "admin.menu.staffPayroll", 
      icon: UserCheck, 
      badge: pendingPayrollCount > 0 ? pendingPayrollCount : null 
    },
    { path: "/admin/room-occupancy", label: "admin.menu.roomOccupancy", icon: Building2 },
    { path: "/admin/reports-analytics", label: "admin.menu.reportsAnalytics", icon: FileText },
    { path: "/admin/settings", label: "admin.menu.settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear token and call parent logout handler
      setToken(null);
      if (onLogout) {
        onLogout();
      }
      navigate("/login");
    }
  };

  // Calculate total pending notifications
  const totalPendingNotifications = pendingTicketsCount + pendingFormsCount + overdueExpensesCount + pendingPayrollCount;

  return (
  <div className="h-screen flex overflow-hidden bg-background transition-colors duration-200">
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Fixed Sidebar - Consistent Width */}
      <div
        className={`
          fixed lg:static 
          inset-y-0 left-0
          w-64 
          bg-card
          border-r border-border
          shadow-sm 
          transform transition-all duration-300 
          z-50 lg:translate-x-0
          flex-shrink-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section - Fixed */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t('admin.panelTitle')}</h2>
                <p className="text-xs text-muted-foreground">{t('admin.managementSystem')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-muted transition-colors lg:hidden"
            >
              <X className="h-5 w-5 text-muted-foreground dark:text-muted-foreground" />
            </button>
          </div>

          {/* Navigation - Scrollable if needed */}
          <nav className="flex-1 p-4 bg-card overflow-y-auto">
                <div className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.path} className="relative">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-foreground hover:bg-blue-50 hover:text-blue-600"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {/* Left side: Icon and Text */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {item.isMultiline ? (
                          <div className="text-sm font-medium">
                            <div className="leading-tight">{t('admin.menu.expensesLine1')}</div>
                            <div className="leading-tight">{t('admin.menu.expensesLine2')}</div>
                          </div>
                        ) : (
                          <span className="text-sm truncate block">{t(item.label)}</span>
                        )}
                      </div>
                    </div>
                  </NavLink>

                  {/* Badge - Fixed positioning */}
                  {item.badge && (
                    <div 
                      className="absolute right-3 pointer-events-none"
                      style={{ top: '8px' }}
                    >
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 font-bold">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* User Info & Logout - Fixed at Bottom */}
          <div className="flex-shrink-0 p-4 border-t border-border bg-card">
                <div className="mb-3 p-2 bg-background rounded-lg">
                <p className="text-sm font-medium text-foreground">{t('admin.loggedInAs')}</p>
                <p className="text-xs text-muted-foreground">{t('admin.profile.role')}</p>
              </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">{t('admin.profile.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Top Navigation */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Top Navigation Bar - Always Visible Across All Admin Pages */}
  <header className="flex-shrink-0 bg-card border-b border-border shadow-sm z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side - Brand & Mobile Menu */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-md hover:bg-muted lg:hidden"
                >
                  <Menu className="h-6 w-6 text-muted-foreground" />
                </button>
                
                {/* Brand */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SL</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">Stay Leap</h1>
                    <p className="text-xs text-muted-foreground">Data Management</p>
                  </div>
                </div>
              </div>

              {/* Center - Search */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder={t('admin.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground text-sm placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Right Side - Notifications & Profile */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                    <Bell className="h-6 w-6" />
                    {/* Notification badge - showing total pending items */}
                    {totalPendingNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalPendingNotifications}
                      </span>
                    )}
                  </button>
                </div>

                {/* Profile Section */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-foreground">{t('admin.profile.title')}</p>
                      <p className="text-xs text-muted-foreground">{t('admin.profile.role')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setShowProfileDropdown(false)}
                      />
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-card dark:bg-card shadow-lg rounded-lg border border-border z-40">
                        <div className="p-3 border-b border-border">
                          <p className="text-sm font-medium text-foreground">{t('admin.profile.title')}</p>
                          <p className="text-xs text-muted-foreground">{t('admin.profile.role')}</p>
                        </div>
                        
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowProfileDropdown(false);
                              navigate("/admin/profile");
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <User className="h-4 w-4" />
                            {t('admin.profile.viewProfile')}
                          </button>
                          
                          <button
                            onClick={() => {
                              setShowProfileDropdown(false);
                              navigate("/admin/settings");
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            {t('admin.profile.settings')}
                          </button>
                        </div>

                        <div className="border-t border-border py-2">
                          <button
                            onClick={() => {
                              setShowProfileDropdown(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            {t('admin.profile.logout')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* Language selector */}
                <div className="ml-4">
                  <LanguageSelector />
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder={t('admin.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground text-sm placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area - Only This Scrolls */}
  <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-4 max-w-lg w-full mx-4 relative">
            <button
              onClick={() => setShowChatbot(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
            <Chatbot />
          </div>
        </div>
      )}

      {/* ChatbotVoiceButtons - Always visible */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Voice Assistant Button */}
        <button
          onClick={() => {
            setIsListening(!isListening);
            if (!isListening) {
              console.log("Voice Assistant activated - Start listening");
            } else {
              console.log("Voice Assistant deactivated - Stop listening");
            }
          }}
          className={`w-14 h-14 ${
            isListening 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 ${
            isListening 
              ? "focus:ring-red-300" 
              : "focus:ring-blue-300"
          } focus:ring-opacity-50 sm:w-12 sm:h-12`}
          aria-label={isListening ? "Stop Listening" : "Voice Assistant"}
          title={isListening ? "Stop Listening" : "Voice Assistant"}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 sm:h-5 sm:w-5" />
          ) : (
            <Mic className="h-6 w-6 sm:h-5 sm:w-5" />
          )}
        </button>

        {/* Chatbot Button */}
        <button
          onClick={() => setShowChatbot(true)}
          className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 sm:w-12 sm:h-12"
          aria-label="Chatbot"
          title="Chatbot"
        >
          <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
};

export default AdminLayout;