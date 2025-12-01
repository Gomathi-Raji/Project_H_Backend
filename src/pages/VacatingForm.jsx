import { useState } from "react";
import { Calendar } from "lucide-react";
import apiFetch from "@/lib/apiClient";

const VacatingForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    roomNumber: "",
    vacatingDate: "",
    reason: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        vacatingDate: formData.vacatingDate,
        reason: formData.reason,
        additionalNotes: `Full Name: ${formData.fullName}, Room: ${formData.roomNumber}`
      };

      await apiFetch("/vacating-requests", {
        method: "POST",
        body: requestData
      });

      setSuccess(true);
      setFormData({
        fullName: "",
        roomNumber: "",
        vacatingDate: "",
        reason: ""
      });
    } catch (err) {
      setError(err.message || "Failed to submit vacating request");
      console.error("Vacating request error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
          <div className="text-green-600 dark:text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">Request Submitted Successfully!</h2>
          <p className="text-green-800 dark:text-green-200 mb-4">
            Your vacating request has been submitted and is pending approval.
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Vacating Form</h1>
        <p className="text-muted-foreground mt-2">
          Submit your hostel vacation request with the required details
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
      <div className="bg-card shadow-card rounded-lg border border-border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          {/* Room Number */}
          <div>
            <label
              htmlFor="roomNumber"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Room Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          {/* Vacating Date */}
          <div>
            <label
              htmlFor="vacatingDate"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Intended Vacating Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                id="vacatingDate"
                name="vacatingDate"
                value={formData.vacatingDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Reason for Vacating <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please provide the reason for vacating the hostel (e.g., course completion, job relocation, personal reasons, etc.)"
              rows={5}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-light-green rounded-lg">
          <h3 className="text-sm font-medium text-light-green-foreground mb-2">
            Important Information:
          </h3>
          <ul className="text-sm text-light-green-foreground space-y-1">
            <li>• Please submit this form at least 30 days before your intended vacating date</li>
            <li>• Ensure all dues are cleared before vacating</li>
            <li>• Room inspection will be scheduled within 7 days of your vacating date</li>
            <li>• Security deposit will be refunded after successful room inspection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VacatingForm;
