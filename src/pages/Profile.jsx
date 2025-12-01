import React, { useState, useEffect } from "react";
import { User, Save, X, DollarSign, UtensilsCrossed, Calendar, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiFetch, { setToken } from "@/lib/apiClient";

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    roomNumber: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("personal");
  const [feeBreakdown, setFeeBreakdown] = useState(null);
  const [menu, setMenu] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [roomCategory, setRoomCategory] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load profile data
        const profileData = await apiFetch("/auth/profile");
        setProfile({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          roomNumber: profileData.roomNumber || ""
        });

        // Load fee breakdown
        try {
          const feeData = await apiFetch("/fee-breakdown");
          setFeeBreakdown(feeData);
        } catch (feeError) {
          console.warn("Fee breakdown not available:", feeError);
          setFeeBreakdown({
            roomRent: 5000,
            electricityCharges: 800,
            waterCharges: 300,
            maintenance: 500,
            totalMonthlyFee: 6600
          });
        }

        // Load menu
        try {
          const menuData = await apiFetch("/menu");
          setMenu(menuData);
        } catch (menuError) {
          console.warn("Menu not available:", menuError);
          setMenu([]);
        }

        // Load timetable
        try {
          const timetableData = await apiFetch("/timetable");
          setTimetable(timetableData);
        } catch (timetableError) {
          console.warn("Timetable not available:", timetableError);
          setTimetable([]);
        }

        // Load room category
        try {
          const roomData = await apiFetch("/room-category");
          setRoomCategory(roomData);
        } catch (roomError) {
          console.warn("Room category not available:", roomError);
          setRoomCategory({
            roomType: "Double Sharing (AC)",
            roomNumber: profileData.roomNumber || "Not Assigned",
            floor: "2nd Floor",
            amenities: ["AC", "Attached Bathroom", "WiFi", "Study Table", "Wardrobe"]
          });
        }

      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await apiFetch("/auth/profile", { method: "PUT", body: profile });
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      try { setToken(null); } catch (e) {}
      if (onLogout) onLogout();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Personal Details</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input 
                name="email" 
                value={profile.email} 
                disabled 
                className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <input 
                name="phone" 
                value={profile.phone} 
                onChange={handleChange} 
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Room Number</label>
              <input 
                name="roomNumber" 
                value={profile.roomNumber} 
                onChange={handleChange} 
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Save className="h-4 w-4" />}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }} 
              className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 flex items-center gap-2 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Full Name</p>
            <p className="text-sm font-medium text-foreground">{profile.name || "Not set"}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="text-sm font-medium text-foreground">{profile.email || "Not set"}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Phone</p>
            <p className="text-sm font-medium text-foreground">{profile.phone || "Not set"}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Room Number</p>
            <p className="text-sm font-medium text-foreground">{profile.roomNumber || "Not set"}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderFeeBreakdown = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Fee Breakdown</h2>
      {feeBreakdown ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="text-foreground">Room Rent</span>
            <span className="font-semibold text-foreground">₹{feeBreakdown.roomRent}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="text-foreground">Electricity Charges</span>
            <span className="font-semibold text-foreground">₹{feeBreakdown.electricityCharges}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="text-foreground">Water Charges</span>
            <span className="font-semibold text-foreground">₹{feeBreakdown.waterCharges}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="text-foreground">Maintenance</span>
            <span className="font-semibold text-foreground">₹{feeBreakdown.maintenance}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-blue-500">
            <span className="font-semibold text-foreground">Total Monthly Fee</span>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">₹{feeBreakdown.totalMonthlyFee}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Fee breakdown data not available</p>
        </div>
      )}
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Hostel Menu</h2>
      {menu.length > 0 ? (
        <div className="space-y-4">
          {menu.map((dayMenu) => (
            <div key={dayMenu.day} className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">{dayMenu.day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Breakfast</p>
                  <p className="text-sm text-foreground">{dayMenu.breakfast}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lunch</p>
                  <p className="text-sm text-foreground">{dayMenu.lunch}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dinner</p>
                  <p className="text-sm text-foreground">{dayMenu.dinner}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Menu data not available</p>
        </div>
      )}
    </div>
  );

  const renderTimetable = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Hostel Timetable</h2>
      {timetable.length > 0 ? (
        <div className="space-y-3">
          {timetable.map((slot) => (
            <div key={slot.time} className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{slot.activity}</span>
                <span className="text-foreground">{slot.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Timetable data not available</p>
        </div>
      )}
    </div>
  );

  const renderRoomCategory = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Room Category</h2>
      {roomCategory ? (
        <div className="p-6 bg-muted rounded-lg">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Room Type</p>
              <p className="text-xl font-semibold text-foreground">{roomCategory.roomType || "Not Assigned"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="text-lg font-medium text-foreground">{roomCategory.roomNumber || "Not Assigned"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Floor</p>
              <p className="text-lg font-medium text-foreground">{roomCategory.floor || "Not Specified"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amenities</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {roomCategory.amenities && roomCategory.amenities.length > 0 ? (
                  roomCategory.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">No amenities listed</span>
                )}
              </div>
            </div>
            {roomCategory.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm text-foreground">{roomCategory.description}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Room category data not available</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white">
            <User className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account and hostel information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-4 space-y-2">
            <button
              onClick={() => setActiveSection("personal")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "personal"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Personal Details</span>
            </button>
            
            <button
              onClick={() => setActiveSection("fees")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "fees"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <DollarSign className="h-5 w-5" />
              <span className="font-medium">Fee Breakdown</span>
            </button>
            
            <button
              onClick={() => setActiveSection("menu")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "menu"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <UtensilsCrossed className="h-5 w-5" />
              <span className="font-medium">Menu</span>
            </button>
            
            <button
              onClick={() => setActiveSection("timetable")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "timetable"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Timetable</span>
            </button>
            
            <button
              onClick={() => setActiveSection("room")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "room"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Room Category</span>
            </button>

            <div className="pt-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border p-6">
            {activeSection === "personal" && renderPersonalDetails()}
            {activeSection === "fees" && renderFeeBreakdown()}
            {activeSection === "menu" && renderMenu()}
            {activeSection === "timetable" && renderTimetable()}
            {activeSection === "room" && renderRoomCategory()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
