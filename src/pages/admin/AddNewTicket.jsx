import React, { useState } from "react";
import { Upload, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddNewTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenantName: "",
    issueCategory: "",
    description: "",
    priority: "",
    image: null
  });

  const tenantOptions = [];

  const categoryOptions = [
    "Plumbing",
    "Electrical", 
    "Air Conditioning",
    "Maintenance",
    "Security",
    "Other"
  ];

  const priorityOptions = [
    "Low",
    "Medium", 
    "High"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ticket submitted:", formData);
    // Handle form submission
    navigate("/admin/dashboard");
  };

  return (
  <div className="p-6 bg-datahub-bg min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Add New Ticket</h1>
        </div>
        <p className="text-muted-foreground">Create a new maintenance or payment ticket for tenants</p>
      </div>

      {/* Form */}
  <div className="bg-card rounded-xl shadow-lg border border-gray-200 p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tenant Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tenant Name <span className="text-red-500">*</span>
              </label>
              <select
                name="tenantName"
                value={formData.tenantName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a tenant</option>
                {tenantOptions.map((tenant, index) => (
                  <option key={index} value={tenant}>
                    {tenant}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <select
                name="issueCategory"
                value={formData.issueCategory}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categoryOptions.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Provide detailed description of the issue..."
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select priority</option>
                {priorityOptions.map((priority, index) => (
                  <option key={index} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Image (Optional)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {formData.image ? formData.image.name : "Click to upload image"}
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewTicket;
