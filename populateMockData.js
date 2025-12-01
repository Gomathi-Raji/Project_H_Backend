import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tenant from './models/Tenant.js';
import Room from './models/Room.js';
import Payment from './models/Payment.js';
import Ticket from './models/Ticket.js';
import Expense from './models/Expense.js';
import VacatingRequest from './models/VacatingRequest.js';
import ExchangeRequest from './models/ExchangeRequest.js';

// Load environment variables
dotenv.config();

const populateMockData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel-management');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tenant.deleteMany({});
    await Room.deleteMany({});
    await Payment.deleteMany({});
    await Ticket.deleteMany({});
    await Expense.deleteMany({});
    await VacatingRequest.deleteMany({});
    await ExchangeRequest.deleteMany({});

    console.log('Cleared existing data');

    // Create Users (3-5 of each role)
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      // Admins
      { name: 'Admin User 1', email: 'admin1@example.com', password: hashedPassword, role: 'admin', phone: '1234567890' },
      { name: 'Admin User 2', email: 'admin2@example.com', password: hashedPassword, role: 'admin', phone: '1234567891' },

      // Staff
      { name: 'Staff User 1', email: 'staff1@example.com', password: hashedPassword, role: 'staff', phone: '2234567890' },
      { name: 'Staff User 2', email: 'staff2@example.com', password: hashedPassword, role: 'staff', phone: '2234567891' },
      { name: 'Staff User 3', email: 'staff3@example.com', password: hashedPassword, role: 'staff', phone: '2234567892' },

      // Tenants
      { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: 'tenant', phone: '3234567890' },
      { name: 'Jane Smith', email: 'jane@example.com', password: hashedPassword, role: 'tenant', phone: '3234567891' },
      { name: 'Bob Johnson', email: 'bob@example.com', password: hashedPassword, role: 'tenant', phone: '3234567892' },
      { name: 'Alice Brown', email: 'alice@example.com', password: hashedPassword, role: 'tenant', phone: '3234567893' },
      { name: 'Charlie Wilson', email: 'charlie@example.com', password: hashedPassword, role: 'tenant', phone: '3234567894' },
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created users:', createdUsers.length);

    // Create Rooms (5 rooms)
    const rooms = [
      { number: 'A-101', type: 'single', rent: 5000, capacity: 1, status: 'occupied' },
      { number: 'A-102', type: 'single', rent: 5000, capacity: 1, status: 'occupied' },
      { number: 'B-201', type: 'double', rent: 8000, capacity: 2, status: 'occupied' },
      { number: 'B-202', type: 'double', rent: 8000, capacity: 2, status: 'available' },
      { number: 'C-301', type: 'shared', rent: 3000, capacity: 4, status: 'occupied' },
    ];

    const createdRooms = await Room.insertMany(rooms);
    console.log('Created rooms:', createdRooms.length);

    // Create Tenants (5 tenants)
    const tenants = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '3234567890',
        aadharNumber: '123456789012',
        room: createdRooms[0]._id,
        moveInDate: new Date('2024-01-15'),
        emergencyContactName: 'Mary Doe',
        emergencyContactRelationship: 'Sister',
        emergencyContactPhone: '9876543210',
        securityDeposit: 10000,
        active: true,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '3234567891',
        aadharNumber: '123456789013',
        room: createdRooms[1]._id,
        moveInDate: new Date('2024-02-01'),
        emergencyContactName: 'Tom Smith',
        emergencyContactRelationship: 'Brother',
        emergencyContactPhone: '9876543211',
        securityDeposit: 10000,
        active: true,
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '3234567892',
        aadharNumber: '123456789014',
        room: createdRooms[2]._id,
        moveInDate: new Date('2024-03-10'),
        emergencyContactName: 'Lisa Johnson',
        emergencyContactRelationship: 'Wife',
        emergencyContactPhone: '9876543212',
        securityDeposit: 15000,
        active: true,
      },
      {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@example.com',
        phone: '3234567893',
        aadharNumber: '123456789015',
        room: createdRooms[3]._id,
        moveInDate: new Date('2024-04-05'),
        emergencyContactName: 'Mike Brown',
        emergencyContactRelationship: 'Father',
        emergencyContactPhone: '9876543213',
        securityDeposit: 15000,
        active: false,
      },
      {
        firstName: 'Charlie',
        lastName: 'Wilson',
        email: 'charlie@example.com',
        phone: '3234567894',
        aadharNumber: '123456789016',
        room: createdRooms[4]._id,
        moveInDate: new Date('2024-05-20'),
        emergencyContactName: 'Sarah Wilson',
        emergencyContactRelationship: 'Mother',
        emergencyContactPhone: '9876543214',
        securityDeposit: 12000,
        active: true,
      },
    ];

    const createdTenants = await Tenant.insertMany(tenants);
    console.log('Created tenants:', createdTenants.length);

    // Update user tenantId references
    const tenantUsers = createdUsers.filter(u => u.role === 'tenant');
    for (let i = 0; i < tenantUsers.length; i++) {
      await User.findByIdAndUpdate(tenantUsers[i]._id, { tenantId: createdTenants[i]._id });
    }

    // Create Payments (4-5 payments per tenant)
    const payments = [];
    const paymentDates = [
      new Date('2024-01-01'), new Date('2024-02-01'), new Date('2024-03-01'),
      new Date('2024-04-01'), new Date('2024-05-01'), new Date('2024-06-01'),
      new Date('2024-07-01'), new Date('2024-08-01'), new Date('2024-09-01'),
      new Date('2024-10-01'), new Date('2024-11-01'), new Date('2024-12-01'),
    ];

    for (const tenant of createdTenants) {
      const room = createdRooms.find(r => r._id.toString() === tenant.room.toString());
      for (let i = 0; i < 4; i++) {
        payments.push({
          tenant: tenant._id,
          amount: room.rent,
          method: ['cash', 'online', 'bank_transfer'][Math.floor(Math.random() * 3)],
          paidAt: paymentDates[i],
          notes: `Monthly rent payment for ${room.number}`,
          status: 'completed',
          type: 'rent',
          reference: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        });
      }
    }

    const createdPayments = await Payment.insertMany(payments);
    console.log('Created payments:', createdPayments.length);

    // Create Tickets (5 tickets)
    const tickets = [
      {
        title: 'WiFi not working',
        description: 'Internet connection is very slow in room A-101',
        tenant: createdTenants[0]._id,
        status: 'open',
        priority: 'high',
        category: 'technical',
        notes: 'Customer reported slow internet speeds',
      },
      {
        title: 'Room cleaning request',
        description: 'Room needs deep cleaning and maintenance',
        tenant: createdTenants[1]._id,
        status: 'in_progress',
        assignedTo: createdUsers.find(u => u.role === 'staff')._id,
        priority: 'medium',
        category: 'maintenance',
        notes: 'Assigned to maintenance staff',
      },
      {
        title: 'Payment confirmation',
        description: 'Need confirmation for December rent payment',
        tenant: createdTenants[2]._id,
        status: 'resolved',
        assignedTo: createdUsers.find(u => u.role === 'staff')._id,
        priority: 'low',
        category: 'payment',
        notes: 'Payment confirmed and receipt sent',
      },
      {
        title: 'Water leakage in bathroom',
        description: 'Tap is leaking and causing water wastage',
        tenant: createdTenants[3]._id,
        status: 'open',
        priority: 'high',
        category: 'plumbing',
        notes: 'Urgent repair needed',
      },
      {
        title: 'Security concern',
        description: 'Suspicious activity near main entrance',
        tenant: createdTenants[4]._id,
        status: 'closed',
        assignedTo: createdUsers.find(u => u.role === 'admin')._id,
        priority: 'high',
        category: 'security',
        notes: 'Security team notified and issue resolved',
      },
    ];

    const createdTickets = await Ticket.insertMany(tickets);
    console.log('Created tickets:', createdTickets.length);

    // Create Expenses (5 expenses)
    const expenses = [
      {
        category: 'utilities',
        subcategory: 'Electricity',
        amount: 15000,
        description: 'Monthly electricity bill for all rooms',
        supplier: 'State Electricity Board',
        paymentMethod: 'bank_transfer',
        date: new Date('2024-12-01'),
        status: 'paid',
        approvedBy: createdUsers.find(u => u.role === 'admin')._id,
        paidBy: createdUsers.find(u => u.role === 'admin')._id,
        notes: 'Regular monthly electricity bill',
      },
      {
        category: 'maintenance',
        subcategory: 'Plumbing',
        amount: 8000,
        description: 'Repair of leaking pipes in common bathroom',
        supplier: 'Local Plumbing Services',
        paymentMethod: 'cash',
        date: new Date('2024-11-15'),
        status: 'paid',
        approvedBy: createdUsers.find(u => u.role === 'admin')._id,
        paidBy: createdUsers.find(u => u.role === 'staff')._id,
        notes: 'Emergency repair completed',
      },
      {
        category: 'supplies',
        subcategory: 'Cleaning',
        amount: 3000,
        description: 'Cleaning supplies and detergents',
        supplier: 'SuperMart',
        paymentMethod: 'credit_card',
        date: new Date('2024-11-20'),
        status: 'paid',
        approvedBy: createdUsers.find(u => u.role === 'admin')._id,
        paidBy: createdUsers.find(u => u.role === 'staff')._id,
        notes: 'Monthly cleaning supplies purchase',
      },
      {
        category: 'staff',
        subcategory: 'Salary',
        amount: 25000,
        description: 'Monthly salary for maintenance staff',
        paymentMethod: 'bank_transfer',
        date: new Date('2024-12-01'),
        status: 'pending',
        approvedBy: createdUsers.find(u => u.role === 'admin')._id,
        notes: 'December salary payment',
      },
      {
        category: 'other',
        subcategory: 'Miscellaneous',
        amount: 5000,
        description: 'Miscellaneous hostel expenses',
        paymentMethod: 'cash',
        date: new Date('2024-11-25'),
        status: 'approved',
        approvedBy: createdUsers.find(u => u.role === 'admin')._id,
        notes: 'Various small expenses',
      },
    ];

    const createdExpenses = await Expense.insertMany(expenses);
    console.log('Created expenses:', createdExpenses.length);

    // Create Vacating Requests (3 requests)
    const vacatingRequests = [
      {
        tenant: createdTenants[0]._id,
        vacatingDate: new Date('2025-02-28'),
        reason: 'job-relocation',
        additionalNotes: 'Moving to another city for work',
        status: 'pending',
      },
      {
        tenant: createdTenants[1]._id,
        vacatingDate: new Date('2025-01-15'),
        reason: 'personal-reasons',
        additionalNotes: 'Family emergency requiring relocation',
        status: 'approved',
        approvedBy: createdUsers.find(u => u.role === 'admin')._id,
        approvalDate: new Date('2024-12-01'),
        finalSettlementAmount: 5000,
        securityDepositRefund: 8000,
      },
      {
        tenant: createdTenants[2]._id,
        vacatingDate: new Date('2025-03-31'),
        reason: 'education',
        additionalNotes: 'Moving for higher education',
        status: 'pending',
      },
    ];

    const createdVacatingRequests = await VacatingRequest.insertMany(vacatingRequests);
    console.log('Created vacating requests:', createdVacatingRequests.length);

    // Create Exchange Requests (3 requests)
    const exchangeRequests = [
      {
        tenant: createdTenants[0]._id,
        currentRoom: createdRooms[0]._id,
        desiredRoom: createdRooms[1]._id,
        reason: 'location-preference',
        preferredDate: new Date('2025-01-15'),
        additionalNotes: 'Prefer a room closer to the main entrance',
        status: 'pending',
      },
      {
        tenant: createdTenants[1]._id,
        currentRoom: createdRooms[1]._id,
        desiredRoom: createdRooms[2]._id,
        reason: 'room-condition',
        preferredDate: new Date('2025-02-01'),
        additionalNotes: 'Current room has maintenance issues',
        status: 'approved',
        approvedBy: createdUsers.find(u => u.role === 'admin')._id,
        approvalDate: new Date('2024-12-15'),
        exchangeDate: new Date('2025-02-01'),
      },
      {
        tenant: createdTenants[2]._id,
        currentRoom: createdRooms[2]._id,
        desiredRoom: createdRooms[4]._id,
        reason: 'room-type',
        preferredDate: new Date('2025-03-01'),
        additionalNotes: 'Prefer shared room for cost savings',
        status: 'pending',
      },
    ];

    const createdExchangeRequests = await ExchangeRequest.insertMany(exchangeRequests);
    console.log('Created exchange requests:', createdExchangeRequests.length);

    console.log('\n=== Mock Data Population Complete ===');
    console.log('Summary:');
    console.log(`- Users: ${createdUsers.length} (Admins: 2, Staff: 3, Tenants: 5)`);
    console.log(`- Rooms: ${createdRooms.length}`);
    console.log(`- Tenants: ${createdTenants.length}`);
    console.log(`- Payments: ${createdPayments.length}`);
    console.log(`- Tickets: ${createdTickets.length}`);
    console.log(`- Expenses: ${createdExpenses.length}`);
    console.log(`- Vacating Requests: ${createdVacatingRequests.length}`);
    console.log(`- Exchange Requests: ${createdExchangeRequests.length}`);

    console.log('\n=== Sample Login Credentials ===');
    console.log('Admin: admin1@example.com / password123');
    console.log('Staff: staff1@example.com / password123');
    console.log('Tenant: john@example.com / password123');

  } catch (error) {
    console.error('Error populating mock data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
populateMockData();