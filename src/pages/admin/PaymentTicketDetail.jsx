import React, { useState } from "react";
import { ArrowLeft, DollarSign, Calendar, User, CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PaymentTicketDetail = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [isPaid, setIsPaid] = useState(false);

  // Mock ticket data
  const ticketData = {
    id: ticketId || "",
    tenantName: "",
    roomNumber: "",
    issueType: "",
    totalAmount: 0,
    paidAmount: 0,
    remainingBalance: 0,
    paymentDueDate: "",
    status: "",
    generatedDate: "",
    description: ""
  };

  const paymentHistory = [];

  const handleMarkAsPaid = () => {
    setIsPaid(true);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate("/admin/payment-ticketing")}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Ticket Details</h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base">Invoice-style payment ticket layout</p>
      </div>

      {/* Ticket Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-8 mb-6">
        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 md:pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Payment Invoice</h2>
            <p className="text-gray-600 text-sm">Ticket ID: {ticketData.id}</p>
            <p className="text-gray-600 text-sm">Generated: {ticketData.generatedDate}</p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isPaid || ticketData.status === 'Paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isPaid ? 'Paid' : ticketData.status}
            </div>
          </div>
        </div>

        {/* Tenant & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <User className="h-5 w-5" /> Tenant Information
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-900 font-medium">{ticketData.tenantName}</p>
              <p className="text-gray-600">Room: {ticketData.roomNumber}</p>
              <p className="text-gray-600">Issue Type: {ticketData.issueType}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Payment Details
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">Due Date: {ticketData.paymentDueDate}</p>
              <p className="text-gray-600">Description: {ticketData.description}</p>
            </div>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Amount Breakdown
          </h3>
          <div className="space-y-2 text-sm md:text-base">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-gray-900">₹{ticketData.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid Amount:</span>
              <span className="font-medium text-green-600">₹{isPaid ? ticketData.totalAmount.toLocaleString() : ticketData.paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="text-gray-900 font-medium">Remaining Balance:</span>
              <span className="font-bold text-red-600">₹{isPaid ? '0' : ticketData.remainingBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isPaid && ticketData.status !== 'Paid' && (
          <div className="mb-4">
            <button
              onClick={handleMarkAsPaid}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 md:py-3 px-4 md:px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Mark as Paid
            </button>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" /> Payment History
        </h3>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 text-sm font-medium text-gray-500">Payment ID</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Amount Paid</th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">Mode</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map(payment => (
                <tr key={payment.id} className="border-b border-gray-100">
                  <td className="p-3 text-sm font-medium text-gray-900">{payment.id}</td>
                  <td className="p-3 text-sm text-gray-600">{payment.date}</td>
                  <td className="p-3 text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</td>
                  <td className="p-3 text-sm text-gray-600">{payment.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-3">
          {paymentHistory.map(payment => (
            <div key={payment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-900">{payment.id}</span>
                <span className="text-sm text-gray-600">{payment.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600">Mode:</span>
                <span className="text-gray-900 font-medium">{payment.mode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentTicketDetail;
