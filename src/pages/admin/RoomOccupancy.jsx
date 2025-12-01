import React, { useState, useEffect } from "react";
import {
  Home,
  Plus,
  Search,
  Users,
  Wrench,
  X,
} from "lucide-react";
import apiFetch from '@/lib/apiClient';

const RoomOccupancy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddCards, setShowAddCards] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomTypes = ["single", "double", "shared"];

  // Load rooms on component mount
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/rooms');
      setRooms(response.rooms || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "occupied":
        return `${baseClasses} bg-green-100 text-green-700 border border-green-300`;
      case "available":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-300`;
      case "maintenance":
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-300`;
      default:
  return `${baseClasses} bg-card text-foreground border border-border`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "occupied":
        return <Users className="h-4 w-4" />;
      case "available":
        return <Home className="h-4 w-4" />;
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const handleQuickAddRoom = async (roomType) => {
    const roomNumber = prompt(`Enter room number for ${roomType} room:`);
    if (!roomNumber) return;

    try {
      let capacity, rent, type;
      switch (roomType) {
        case "Single":
          capacity = 1;
          rent = 5000;
          type = "single";
          break;
        case "Double":
          capacity = 2;
          rent = 8000;
          type = "double";
          break;
        case "Shared":
          capacity = 2;
          rent = 3000;
          type = "shared";
          break;
        default:
          capacity = 1;
          rent = 5000;
          type = "single";
      }

      const roomData = {
        number: roomNumber,
        type: type,
        capacity: capacity,
        rent: rent,
        status: "available",
      };

      await apiFetch('/rooms', {
        method: 'POST',
        body: roomData
      });

      alert(`${roomType} room ${roomNumber} added successfully!`);
      loadRooms(); // Reload the rooms list
    } catch (err) {
      console.error('Error adding room:', err);
      alert(err.message || 'Failed to add room');
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.tenants &&
        room.tenants.some((tenant) =>
          tenant.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesStatus =
      statusFilter === "all" ||
      room.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType =
      typeFilter === "all" ||
      room.type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 bg-datahub-bg min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-room-primary">
            Room Occupancy
          </h1>
          <p className="text-admin-content-text mt-2">
            Manage room availability and assignments
          </p>
        </div>
        <button
          onClick={() => setShowAddCards(!showAddCards)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </button>
      </div>

      {/* Filters */}
  <div className="bg-card rounded-xl shadow-lg border border-border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search by Room Number, Floor, or Tenant"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
            >
              <option value="all">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="shared">Shared</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <p className="text-center text-muted-foreground mt-10">Loading rooms...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-10">{error}</p>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="bg-card rounded-lg border shadow hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(room.status)}
                    <h3 className="text-lg font-semibold">{room.number}</h3>
                  </div>
                  <span className={getStatusBadge(room.status)}>
                    {room.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    <span>{room.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Capacity:</span>
                    <span>{room.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rent:</span>
                    <span>₹{room.rentAmount ? room.rentAmount.toLocaleString() : 'N/A'}</span>
                  </div>
                  {room.tenants && room.tenants.length > 0 && (
                    <div className="flex flex-col text-sm">
                      <span>Tenants:</span>
                      <ul className="list-disc list-inside">
                        {room.tenants.map((tenant, i) => (
                          <li key={i}>{tenant}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-10">No rooms found.</p>
      )}

      {/* Add Room Cards */}
      {showAddCards && (
        <div className="bg-card rounded-xl shadow-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Add Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Single Room Card */}
            <div
              onClick={() => handleQuickAddRoom("Single")}
              className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Home className="h-6 w-6 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Single Room</h4>
              </div>
              <p className="text-sm text-blue-600 mb-2">Perfect for individual tenants</p>
              <div className="text-xs text-blue-500">
                <div>Capacity: 1</div>
                <div>Standard amenities</div>
              </div>
            </div>

            {/* Double Room Card */}
            <div
              onClick={() => handleQuickAddRoom("Double")}
              className="bg-green-50 border-2 border-green-200 rounded-lg p-4 cursor-pointer hover:bg-green-100 hover:border-green-300 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-green-600" />
                <h4 className="font-semibold text-green-800">Double Room</h4>
              </div>
              <p className="text-sm text-green-600 mb-2">Premium accommodation for couples</p>
              <div className="text-xs text-green-500">
                <div>Capacity: 2</div>
                <div>Enhanced amenities</div>
              </div>
            </div>

            {/* Shared Room Card */}
            <div
              onClick={() => handleQuickAddRoom("Shared")}
              className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 cursor-pointer hover:bg-purple-100 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Home className="h-6 w-6 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Shared Room</h4>
              </div>
              <p className="text-sm text-purple-600 mb-2">Cost-effective shared accommodation</p>
              <div className="text-xs text-purple-500">
                <div>Capacity: 2-4</div>
                <div>Shared facilities</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomOccupancy;
