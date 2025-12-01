import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Palette,
  Bell,
  Save,
  X,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from 'react-i18next';
import apiFetch from "@/lib/apiClient";

const Settings = () => {
  const { theme, setTheme: updateTheme } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newTenants: true,
      paymentReminders: true,
      maintenanceRequests: true,
      systemUpdates: false,
    },
    appNotifications: {
      pushNotifications: true,
      soundAlerts: true,
      desktopNotifications: false,
    },
  });

  const tabs = [
    { id: "profile", label: t('settings.tabs.profile'), icon: User },
    { id: "password", label: t('settings.tabs.password'), icon: Lock },
    { id: "theme", label: t('settings.tabs.theme'), icon: Palette },
    { id: "notifications", label: t('settings.tabs.notifications'), icon: Bell },
  ];

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await apiFetch('/auth/profile');

      setProfileData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });

      if (userData.settings) {
        // Theme is handled by ThemeContext
        setNotificationSettings(userData.settings.notifications || notificationSettings);
      }
    } catch (err) {
      setError(err.message || "Failed to load user data");
      console.error("Error loading user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleNotificationChange = (category, setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [category]: {
        ...notificationSettings[category],
        [setting]: !notificationSettings[category][setting],
      },
    });
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      await apiFetch('/auth/profile', {
        method: 'PUT',
        body: profileData
      });
      showSuccess("Profile updated successfully!");
    } catch (err) {
      showError(err.message || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError("Password must be at least 6 characters long!");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await apiFetch('/auth/change-password', {
        method: 'PUT',
        body: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      });
      showSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showError(err.message || "Failed to change password");
      console.error("Error changing password:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      setError(null);
      await apiFetch('/auth/settings', {
        method: 'PUT',
        body: {
          theme: theme,
          notifications: notificationSettings
        }
      });
      showSuccess("Notification settings updated successfully!");
    } catch (err) {
      showError(err.message || "Failed to update notification settings");
      console.error("Error updating notifications:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTheme = async () => {
    try {
      setSaving(true);
      setError(null);
      await apiFetch('/auth/settings', {
        method: 'PUT',
        body: {
          theme: theme,
          notifications: notificationSettings
        }
      });
      showSuccess("Theme preference updated successfully!");
    } catch (err) {
      showError(err.message || "Failed to update theme");
      console.error("Error updating theme:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('settings.subtitle')}</p>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">{success}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all text-center ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
  <div className="bg-card rounded-lg shadow border border-border p-4 space-y-6 w-full">
        {/* Profile */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <User className="h-4 w-4" /> Profile Information
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {["name", "email", "phone"].map(
                (field, idx) => (
                  <div key={idx}>
                    <label className="text-sm text-foreground mb-1 block capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={profileData[field]}
                      onChange={handleProfileChange}
                      className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                ) : (
                  <Save className="inline h-4 w-4 mr-1" />
                )}
                Save
              </button>
              <button className="w-full bg-card text-foreground py-2 rounded-md hover:bg-muted transition-colors">
                <X className="inline h-4 w-4 mr-1" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Password */}
        {activeTab === "password" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <Lock className="h-4 w-4" /> Change Password
            </h2>
            <div className="space-y-3">
              {["currentPassword", "newPassword", "confirmPassword"].map(
                (field, idx) => (
                  <div key={idx} className="relative">
                    <label className="block text-sm text-foreground mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={
                        (field === "currentPassword" && showCurrentPassword) ||
                        (field === "newPassword" && showNewPassword) ||
                        (field === "confirmPassword" && showConfirmPassword)
                          ? "text"
                          : "password"
                      }
                      name={field}
                      value={passwordData[field]}
                      onChange={handlePasswordChange}
                      className="w-full border border-border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (field === "currentPassword")
                          setShowCurrentPassword(!showCurrentPassword);
                        else if (field === "newPassword")
                          setShowNewPassword(!showNewPassword);
                        else setShowConfirmPassword(!showConfirmPassword);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {(field === "currentPassword" && showCurrentPassword) ||
                      (field === "newPassword" && showNewPassword) ||
                      (field === "confirmPassword" && showConfirmPassword) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSavePassword}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                ) : (
                  <Save className="inline h-4 w-4 mr-1" />
                )}
                Update
              </button>
              <button className="w-full bg-card text-foreground py-2 rounded-md hover:bg-muted transition-colors">
                <X className="inline h-4 w-4 mr-1" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Theme */}
        {activeTab === "theme" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Theme Preference
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: "light", label: "Light", icon: Sun, desc: "Bright" },
                { id: "dark", label: "Dark", icon: Moon, desc: "Eye-friendly" },
                
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateTheme(option.id)}
                  className={`w-full border-2 rounded-md p-3 text-left ${
                    theme === option.id ? "border-blue-600 bg-blue-50" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <option.icon
                      className={`h-5 w-5 ${
                        theme === option.id ? "text-blue-600" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`${
                        theme === option.id ? "text-blue-600" : "text-foreground"
                      } font-medium`}
                    >
                      {option.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveTheme}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                ) : (
                  <Save className="inline h-4 w-4 mr-1" />
                )}
                Save
              </button>
              <button className="w-full bg-card text-foreground py-2 rounded-md hover:bg-muted transition-colors">
                <X className="inline h-4 w-4 mr-1" /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </h2>
            <div className="space-y-2">
              {Object.entries(notificationSettings.emailNotifications).map(
                ([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="capitalize text-foreground">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <button
                      onClick={() =>
                        handleNotificationChange("emailNotifications", key)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 bg-white rounded-full transform transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveNotifications}
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2"></div>
                ) : (
                  <Save className="inline h-4 w-4 mr-1" />
                )}
                Save
              </button>
              <button className="w-full bg-card text-foreground py-2 rounded-md hover:bg-muted transition-colors">
                <X className="inline h-4 w-4 mr-1" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;









