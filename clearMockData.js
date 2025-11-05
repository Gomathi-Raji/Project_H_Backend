import mongoose from 'mongoose';
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

const clearMockData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hostel-management');
    console.log('Connected to MongoDB');

    console.log('🗑️  Clearing all mock data...');

    // Clear all collections
    const collections = [
      { name: 'Users', model: User },
      { name: 'Tenants', model: Tenant },
      { name: 'Rooms', model: Room },
      { name: 'Payments', model: Payment },
      { name: 'Tickets', model: Ticket },
      { name: 'Expenses', model: Expense },
      { name: 'Vacating Requests', model: VacatingRequest },
      { name: 'Exchange Requests', model: ExchangeRequest },
    ];

    for (const collection of collections) {
      const result = await collection.model.deleteMany({});
      console.log(`✅ Cleared ${result.deletedCount} documents from ${collection.name}`);
    }

    console.log('\n🎉 All mock data has been successfully removed from the database!');
    console.log('The database is now clean and ready for fresh data.');

  } catch (error) {
    console.error('❌ Error clearing mock data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
clearMockData();