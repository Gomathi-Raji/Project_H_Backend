import React from 'react';
import { X, CheckCircle, Home, Users, FileText, Calendar } from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Welcome to HostelHub!</h2>
          </div>
          <p className="text-blue-100">Hello {userName}! We're excited to have you here.</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Get Started with Your Account</h3>
            <p className="text-muted-foreground mb-4">
              Here's what you can do to make the most of your hostel management experience:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Home className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Room Management</h4>
              </div>
              <p className="text-sm text-blue-600">
                View your room details, check occupancy status, and manage your accommodation.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Fee Breakdown</h4>
              </div>
              <p className="text-sm text-green-600">
                Access detailed information about your rent, utilities, and other charges.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Menu & Dining</h4>
              </div>
              <p className="text-sm text-purple-600">
                Check weekly meal plans, dietary options, and dining schedules.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">Timetable</h4>
              </div>
              <p className="text-sm text-orange-600">
                Stay updated with hostel events, maintenance schedules, and important dates.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-foreground mb-3">Quick Actions</h4>
            <div className="space-y-2 text-sm">
              <p>• Update your profile information in the Profile section</p>
              <p>• Raise maintenance tickets if you need assistance</p>
              <p>• Check your payment history and due dates</p>
              <p>• Connect with our chatbot for instant help</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;