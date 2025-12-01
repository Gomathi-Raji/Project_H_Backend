import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  FileText,
  Settings,
  LogOut,
  X,
  AlertTriangle,
  ClipboardList,
  Receipt,
  UserCheck,
  Mic,
} from "lucide-react";
import { useTranslation } from 'react-i18next';

const AdminSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Mock counts - in real app, these would come from API/state
  const pendingTicketsCount = 0;
  const pendingFormsCount = 0;
  const overdueExpensesCount = 0;
  const pendingPayrollCount = 0;

  const menuItems = [
    { 
      path: "/admin/dashboard", 
      label: "admin.menu.dashboard", 
      icon: LayoutDashboard 
    },
    { 
      path: "/admin/tenant-management", 
      label: "admin.menu.tenantManagement", 
      icon: Users 
    },
    { 
      path: "/admin/payment-tracking", 
      label: "admin.menu.paymentTracking", 
      icon: CreditCard 
    },
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
    { 
      path: "/admin/room-occupancy", 
      label: "admin.menu.roomOccupancy", 
      icon: Building2 
    },
    { 
      path: "/admin/reports-analytics", 
      label: "admin.menu.reportsAnalytics", 
      icon: FileText 
    },
    { 
      path: "/admin/settings", 
      label: "admin.menu.settings", 
      icon: Settings 
    },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar - Fixed Width */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 z-40 transition-all duration-300 lg:relative lg:translate-x-0 w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 shadow-sm ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('admin.panelTitle')}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('admin.managementSystemShort')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.path} className="relative">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-blue-600 dark:bg-blue-600 text-white shadow"
                          : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    end
                  >
                    {/* Left side: Icon and Text */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {item.isMultiline ? (
                          <div className="text-sm font-medium">
                            <div className="leading-tight">{t('admin.menu.expensesLine1')}</div>
                            <div className="leading-tight">{t('admin.menu.expensesLine2')}</div>
                          </div>
                        ) : (
                          <span className="text-sm font-medium truncate block">{t(item.label)}</span>
                        )}
                      </div>
                    </div>
                  </NavLink>
                  
                  {/* Badge - Consistent positioning */}
                  {item.badge && (
                    <div 
                      className="absolute right-4 pointer-events-none"
                      style={{ top: '12px' }}
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">{t('admin.profile.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;