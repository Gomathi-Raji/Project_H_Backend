import React, { useState } from "react";
import { X } from "lucide-react";

const AddTenantModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    aadhar: "",
    room: "",
    moveInDate: "",
    emergencyContact: "",
    securityDeposit: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aadhaar Validation (12-digit number)
    const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
    if (!aadhaarRegex.test(formData.aadhar)) {
      alert("Please enter a valid 12-digit Aadhaar number!");
      return;
    }

    console.log("Tenant Data:", formData);
    onClose();
  };

  // Helper to display labels with *
  const RequiredLabel = ({ children }) => (
    <span>
      {children} <span className="text-red-600">*</span>
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
  <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-background rounded-t-xl">
          <h2 className="text-lg font-semibold text-foreground">Add New Tenant</h2>
          <button
            onClick={onClose}
            className="hover:bg-muted p-1 rounded-full transition"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <RequiredLabel>First Name</RequiredLabel>
              </label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <RequiredLabel>Last Name</RequiredLabel>
              </label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <RequiredLabel>Email Address</RequiredLabel>
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <RequiredLabel>Phone Number</RequiredLabel>
              </label>
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength="10"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              <RequiredLabel>Aadhaar Number</RequiredLabel>
            </label>
            <input
              name="aadhar"
              type="text"
              value={formData.aadhar}
              onChange={handleChange}
              required
              maxLength="12"
              placeholder="Enter 12-digit Aadhaar Number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Room & Move-in Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <RequiredLabel>Room Assignment</RequiredLabel>
              </label>
              <select
                name="room"
                value={formData.room}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room</option>
                <option value="A-101">A-101</option>
                <option value="B-205">B-205</option>
                <option value="C-301">C-301</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <RequiredLabel>Move-in Date</RequiredLabel>
              </label>
              <input
                name="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium mb-1">Emergency Contact</label>
            <input
              name="emergencyContact"
              type="text"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Name, relationship, phone number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Security Deposit */}
          <div>
            <label className="block text-sm font-medium mb-1">Security Deposit</label>
            <input
              name="securityDeposit"
              type="number"
              value={formData.securityDeposit}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenantModal;



