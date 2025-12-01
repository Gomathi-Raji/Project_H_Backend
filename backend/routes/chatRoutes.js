import express from 'express';
import { handleChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected chat endpoint
router.post('/', protect, handleChat);

export default router;
