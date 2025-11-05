import mongoose from 'mongoose';

const chatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['tenant', 'admin'], required: true },
  message: { type: String, required: true },
  reply: { type: String },
  metadata: { type: Object },
}, { timestamps: true });

const ChatLog = mongoose.model('ChatLog', chatLogSchema);
export default ChatLog;
