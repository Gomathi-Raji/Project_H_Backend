import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import apiFetch from '@/lib/apiClient';

const TenantOnboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    aadharNumber: '',
    roomAssignment: '',
    moveInDate: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    securityDeposit: '',
    currentRent: '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAvailableRooms();
  }, []);

  const loadAvailableRooms = async () => {
    try {
      const response = await apiFetch('/rooms');
      setRooms(response.rooms.filter(room => room.status === 'available') || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhaar Number is required';
    if (!formData.roomAssignment) newErrors.roomAssignment = 'Room selection is required';
    if (!formData.moveInDate) newErrors.moveInDate = 'Move-in date is required';
    if (!formData.securityDeposit) newErrors.securityDeposit = 'Security deposit is required';
    if (!formData.currentRent) newErrors.currentRent = 'Current rent is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    // Aadhaar validation (12 digits)
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhaar Number must be 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const tenantData = {
        aadharNumber: formData.aadharNumber,
        room: formData.roomAssignment,
        moveInDate: formData.moveInDate,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactRelationship: formData.emergencyContactRelationship,
        emergencyContactPhone: formData.emergencyContactPhone,
        securityDeposit: parseFloat(formData.securityDeposit),
        currentRent: parseFloat(formData.currentRent),
        dueDate: formData.dueDate
      };

      await apiFetch('/tenants/onboard', {
        method: 'POST',
        body: tenantData
      });

      alert('Onboarding completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert(error.message || 'Onboarding failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">Please provide the following information to complete your tenant registration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Aadhaar Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Aadhaar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                maxLength="12"
                placeholder="Enter 12-digit Aadhaar number"
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.aadharNumber ? 'border-red-500' : 'border-border'}`}
                required
              />
              {errors.aadharNumber && <p className="text-red-500 text-xs mt-1">{errors.aadharNumber}</p>}
            </div>

            {/* Room Assignment */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Room Assignment <span className="text-red-500">*</span>
              </label>
              <select
                name="roomAssignment"
                value={formData.roomAssignment}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.roomAssignment ? 'border-red-500' : 'border-border'}`}
                required
              >
                <option value="">Select a room</option>
                {rooms.map(room => (
                  <option key={room._id} value={room._id}>
                    Room {room.number} - ₹{room.rent}/month ({room.type})
                  </option>
                ))}
              </select>
              {errors.roomAssignment && <p className="text-red-500 text-xs mt-1">{errors.roomAssignment}</p>}
            </div>

            {/* Move-in Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Move-in Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.moveInDate ? 'border-red-500' : 'border-border'}`}
                required
              />
              {errors.moveInDate && <p className="text-red-500 text-xs mt-1">{errors.moveInDate}</p>}
            </div>

            {/* Current Rent */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Rent (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="currentRent"
                value={formData.currentRent}
                onChange={handleInputChange}
                placeholder="Enter monthly rent amount"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.currentRent ? 'border-red-500' : 'border-border'}`}
                required
              />
              {errors.currentRent && <p className="text-red-500 text-xs mt-1">{errors.currentRent}</p>}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rent Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dueDate ? 'border-red-500' : 'border-border'}`}
                required
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>

            {/* Security Deposit */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Security Deposit (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleInputChange}
                placeholder="Enter security deposit amount"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.securityDeposit ? 'border-red-500' : 'border-border'}`}
                required
              />
              {errors.securityDeposit && <p className="text-red-500 text-xs mt-1">{errors.securityDeposit}</p>}
            </div>

            {/* Emergency Contact Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Emergency Contact (Optional)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleInputChange}
                    placeholder="e.g., Parent, Sibling"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  placeholder="Emergency contact phone number"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Completing Setup...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantOnboarding;