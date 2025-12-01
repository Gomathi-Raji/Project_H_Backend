import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  HelpCircle,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import apiFetch, { setToken } from "@/lib/apiClient";
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormsDropdownOpen, setIsFormsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileFormsRef = useRef(null);
  const { theme, setTheme: updateTheme } = useTheme();
  const { t } = useTranslation();

  const handleThemeToggle = () => {
    updateTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Mobile-specific dropdown handler
  const handleMobileFormsToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !isFormsDropdownOpen;
    setIsFormsDropdownOpen(newState);
  };

  // Desktop dropdown handler
  const handleDesktopFormsToggle = () => {
    setIsFormsDropdownOpen(!isFormsDropdownOpen);
  };

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !mobileFormsRef.current?.contains(event.target)
      ) {
        setIsFormsDropdownOpen(false);
      }
    };

    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (isDesktop) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/dashboard", label: "navbar.home", icon: Home },
    { path: "/invoices", label: "navbar.invoices", icon: FileText },
    { path: "/tickets", label: "navbar.tickets", icon: HelpCircle },
  ];

  const formsDropdownItems = [
    { path: "/vacating-form", label: "navbar.forms.vacatingForm" },
    { path: "/exchange-form", label: "navbar.forms.exchangeForm" },
  ];

  const isFormsDropdownActive = formsDropdownItems.some(
    (item) => location.pathname === item.path
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('navbar.logoTitle', 'Hostel Management')}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(item.label)}</span>
                </Link>
              );
            })}

            {/* Forms Dropdown - Desktop */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={handleDesktopFormsToggle}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isFormsDropdownActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>{t('navbar.forms.label', 'Forms')}</span>
                {isFormsDropdownOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {isFormsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
                  {formsDropdownItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsFormsDropdownOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        location.pathname === item.path
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {t(item.label)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Link */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('navbar.profile')}</span>
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={handleThemeToggle}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{theme === 'dark' ? t('navbar.theme.light') : t('navbar.theme.dark')}</span>
            </button>

            {/* Language selector */}
            <div className="flex items-center">
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Regular Navigation Items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Forms Dropdown - Mobile */}
            <div className="space-y-1" ref={mobileFormsRef}>
              <div
                onClick={handleMobileFormsToggle}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleMobileFormsToggle(e);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none ${
                  isFormsDropdownActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600"
                }`}
                style={{
                  WebkitTapHighlightColor: "rgba(0,0,0,0.1)",
                  touchAction: "manipulation",
                  userSelect: "none",
                }}
              >
                <div className="flex items-center space-x-2 pointer-events-none">
                  <FileText className="h-4 w-4" />
                  <span>Forms</span>
                </div>
                <div
                  className="pointer-events-none transition-transform duration-200"
                  style={{
                    transform: isFormsDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <ChevronDown className="h-3 w-3" />
                </div>
              </div>

              {/* Mobile Forms Dropdown with animation */}
              <div
                className={`ml-6 space-y-1 bg-gray-50 dark:bg-gray-700/50 rounded-md transition-all duration-300 ease-in-out overflow-hidden ${
                  isFormsDropdownOpen
                    ? "max-h-32 p-2 opacity-100"
                    : "max-h-0 p-0 opacity-0"
                }`}
                style={{
                  transform: isFormsDropdownOpen
                    ? "translateY(0)"
                    : "translateY(-10px)",
                }}
              >
                {isFormsDropdownOpen &&
                  formsDropdownItems.map((item, index) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsFormsDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
              </div>
            </div>

            {/* Logout Button */}
            {/* Profile (mobile) */}
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>

            {/* Theme Toggle - Mobile */}
            <button
              type="button"
              onClick={() => {
                handleThemeToggle();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
