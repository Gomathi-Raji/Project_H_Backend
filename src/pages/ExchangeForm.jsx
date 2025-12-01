import React, { useState } from "react";
import { ArrowRightLeft, Home, Calendar, User, Phone, Mail, FileText } from "lucide-react";
import apiFetch from "@/lib/apiClient";

const ExchangeForm = () => {
  const [formData, setFormData] = useState({
    currentRoom: "",
    desiredRoom: "",
    reason: "",
    preferredDate: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    additionalNotes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        currentRoom: formData.currentRoom,
        desiredRoom: formData.desiredRoom,
        reason: formData.reason,
        preferredDate: formData.preferredDate,
        additionalNotes: formData.additionalNotes
      };

      await apiFetch("/exchange-requests", {
        method: "POST",
        body: requestData
      });

      setSuccess(true);
      setFormData({
        currentRoom: "",
        desiredRoom: "",
        reason: "",
        preferredDate: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        additionalNotes: ""
      });
    } catch (err) {
      setError(err.message || "Failed to submit exchange request");
      console.error("Exchange request error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
          <div className="text-green-600 dark:text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">Request Submitted Successfully!</h2>
          <p className="text-green-800 dark:text-green-200 mb-4">
            Your room exchange request has been submitted and is pending approval.
            You will receive an email notification once it's reviewed.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <ArrowRightLeft className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-foreground">Room Exchange Form</h1>
        </div>
        <p className="text-muted-foreground">
          Submit a request to exchange your current room with another available room.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="text-red-600 dark:text-red-400 text-xl mr-3">⚠</div>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error submitting request</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-card shadow-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Exchange Request Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Room Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currentRoom" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Current Room Number <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="text"
                id="currentRoom"
                name="currentRoom"
                value={formData.currentRoom}
                onChange={handleInputChange}
                placeholder="e.g., A-101"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="desiredRoom" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Desired Room Number <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="text"
                id="desiredRoom"
                name="desiredRoom"
                value={formData.desiredRoom}
                onChange={handleInputChange}
                placeholder="e.g., B-205"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Full Name <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Your phone number"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address <span className="text-red-500">*</span></span>
                </div>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Preferred Exchange Date <span className="text-red-500">*</span></span>
              </div>
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Reason for Exchange */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Reason for Room Exchange <span className="text-red-500">*</span></span>
              </div>
            </label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a reason</option>
              <option value="roommate-compatibility">Roommate Compatibility Issues</option>
              <option value="noise-issues">Noise Issues</option>
              <option value="room-condition">Room Condition Problems</option>
              <option value="location-preference">Location Preference</option>
              <option value="medical-reasons">Medical Reasons</option>
              <option value="academic-needs">Academic Needs</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-foreground mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows="4"
              placeholder="Any additional information you'd like to provide..."
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Information:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Room exchange requests are subject to availability and approval</li>
              <li>• Processing time is typically 5-7 business days</li>
              <li>• You will be notified via email about the status of your request</li>
              <li>• Additional charges may apply for room differences</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              disabled={loading}
              className="px-6 py-2 border border-input rounded-lg text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Exchange Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExchangeForm;
