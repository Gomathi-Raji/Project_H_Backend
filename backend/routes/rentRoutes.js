import express from 'express';
import {
  sendAlerts,
  markPaymentReceived,
  getPendingPayments,
  getMonthlySummary,
  getLogs,
  seedMockData,
} from '../controllers/rentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin access
router.post('/send-alerts', protect, adminOnly, sendAlerts);
router.post('/mark-payment-received', protect, adminOnly, markPaymentReceived);
router.get('/pending-payments', protect, adminOnly, getPendingPayments);
router.get('/monthly-summary', protect, adminOnly, getMonthlySummary);
router.get('/logs', protect, adminOnly, getLogs);
router.post('/seed-mock-data', protect, adminOnly, seedMockData);

export default router;