import RentPayment from '../models/RentPayment.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import SMSLog from '../models/SMSLog.js';
import { sendSMS } from '../utils/sendSMS.js';
import bcrypt from 'bcryptjs';

// Send rent alerts (due soon / overdue)
export const sendAlerts = async (req, res) => {
  try {
    const now = new Date();
    const dueSoonDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    const pendingPayments = await RentPayment.find({ status: 'Pending' }).populate({
      path: 'userId',
      populate: {
        path: 'propertyId'
      }
    });

    let sent = 0;
    let total = pendingPayments.length;

    for (const payment of pendingPayments) {
      const { userId, amount, dueDate } = payment;
      const tenantName = userId.name;
      const phone = userId.phone;
      const propertyName = userId.propertyId ? userId.propertyId.name : 'Property';

      let message;
      let type;

      if (dueDate <= now) {
        // Overdue
        message = `⚠️ OVERDUE: Hi ${tenantName}, your rent of ₹${amount} was due on ${dueDate.toDateString()}. Please pay immediately.`;
        type = 'overdue';
      } else if (dueDate <= dueSoonDate) {
        // Due soon
        message = `🔔 REMINDER: Hi ${tenantName}, your rent of ₹${amount} for ${propertyName} is due on ${dueDate.toDateString()}.`;
        type = 'reminder';
      } else {
        continue; // Not due soon or overdue
      }

      const smsResult = await sendSMS(phone, message, type);
      if (smsResult.success) sent++;
    }

    res.json({ success: true, sent, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark payment received
export const markPaymentReceived = async (req, res) => {
  try {
    const { userId } = req.body; // or phone

    const payment = await RentPayment.findOneAndUpdate(
      { userId, status: 'Pending' },
      { status: 'Paid' },
      { new: true }
    ).populate({
      path: 'userId',
      populate: {
        path: 'propertyId'
      }
    });

    if (!payment) return res.status(404).json({ message: 'No pending payment found' });

    const { userId: user, amount } = payment;
    const tenantName = user.name;
    const phone = user.phone;

    const message = `✅ Payment Confirmed! Thank you ${tenantName} for paying ₹${amount}.`;
    await sendSMS(phone, message, 'confirmation');

    res.json({ success: true, message: 'Payment confirmed and SMS sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending payments
export const getPendingPayments = async (req, res) => {
  try {
    const payments = await RentPayment.find({ status: 'Pending' }).populate({
      path: 'userId',
      populate: {
        path: 'propertyId'
      }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Monthly summary
export const getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const payments = await RentPayment.find({
      createdAt: { $gte: startDate, $lt: endDate }
    });

    const total = payments.length;
    const paid = payments.filter(p => p.status === 'Paid').length;
    const pending = total - paid;
    const collectionRate = total > 0 ? (paid / total) * 100 : 0;

    res.json({ total, paid, pending, collectionRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get SMS logs
export const getLogs = async (req, res) => {
  try {
    const logs = await SMSLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Seed mock data for testing
export const seedMockData = async (req, res) => {
  try {
    // Clear existing data
    await RentPayment.deleteMany({});
    await Property.deleteMany({});
    await User.deleteMany({ email: { $regex: /^mock/ } }); // Only delete mock users

    // Create mock properties
    const properties = await Property.insertMany([
      { name: "Sunrise Apartments", address: "123 Main Street, City Center" },
      { name: "Green Valley Hostel", address: "456 Oak Avenue, Downtown" },
      { name: "Blue Horizon PG", address: "789 Pine Road, Uptown" }
    ]);

    // Create mock users with hashed passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "mockjohn@example.com",
        phone: "+1234567890",
        password: hashedPassword,
        role: "user",
        propertyId: properties[0]._id
      },
      {
        name: "Jane Smith",
        email: "mockjane@example.com",
        phone: "+1234567891",
        password: hashedPassword,
        role: "user",
        propertyId: properties[1]._id
      },
      {
        name: "Bob Johnson",
        email: "mockbob@example.com",
        phone: "+1234567892",
        password: hashedPassword,
        role: "user",
        propertyId: properties[2]._id
      },
      {
        name: "Alice Brown",
        email: "mockalice@example.com",
        phone: "+1234567893",
        password: hashedPassword,
        role: "user",
        propertyId: properties[0]._id
      },
      {
        name: "Charlie Wilson",
        email: "mockcharlie@example.com",
        phone: "+1234567894",
        password: hashedPassword,
        role: "user",
        propertyId: properties[1]._id
      }
    ]);

    // Create mock rent payments with different due dates
    const now = new Date();
    const rentPayments = [
      // Overdue payments (past due date)
      {
        userId: users[0]._id,
        amount: 15000,
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: "Pending"
      },
      {
        userId: users[1]._id,
        amount: 12000,
        dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        status: "Pending"
      },
      // Due soon (within 3 days)
      {
        userId: users[2]._id,
        amount: 18000,
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        status: "Pending"
      },
      {
        userId: users[3]._id,
        amount: 14000,
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        status: "Pending"
      },
      // Not due yet
      {
        userId: users[4]._id,
        amount: 16000,
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: "Pending"
      },
      // Already paid
      {
        userId: users[0]._id,
        amount: 15000,
        dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        status: "Paid"
      }
    ];

    await RentPayment.insertMany(rentPayments);

    res.json({
      success: true,
      message: "Mock data seeded successfully",
      data: {
        properties: properties.length,
        users: users.length,
        payments: rentPayments.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};