import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatLog from '../models/ChatLog.js';
import User from '../models/User.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' });

const tenantChatFlow = `
1. My Room: If user asks about room, respond with room number, roommates and move-in validity. Offer Room Change option and if user requests, ask for reason and log as a "room_change_request".
2. My Payments: Provide dues, last payment date, and offer to create a mock payment order. If user asks to view past invoices, summarize invoices from DB.
3. Complaints: Allow lodging complaint; collect category, description and create a complaint record (log action).
4. Gate Pass: Accept leave application requests with dates and reason; log and provide tracking id.
5. My Requests: List past requests and statuses from chat logs.
Always ask clarifying question if missing info and keep responses concise.`;

const adminChatFlow = `
1. Approvals & Requests: Show pending approvals for vacating, room change, gate pass. Allow approve/deny and log actions.
2. Complaints: View complaints by category, assign staff and mark resolved.
3. Fees Snapshot: Provide totals, top defaulters, collection percentage and pending dues.
4. Occupancy Status: Report room vacancy percentage and suggest allocations.
5. Tenant Management: View tenant details, deactivate tenants on request.
6. Notices: Create notices to send to tenants and list active notices.
Always keep actions logged and ask for confirmation before performing destructive actions.`;

export const handleChat = async (req, res) => {
  console.log('Chat request received:', { message: req.body.message, role: req.body.role, user: req.user?.name });
  try {
    const { message, role } = req.body;
    const userId = req.user?._id || null;

    // Build role-specific prompt
    const contextPrompt = role === 'admin' ? adminChatFlow : tenantChatFlow;

    // Save incoming message
    const log = await ChatLog.create({ userId, role, message });

    // Call Gemini model
    const prompt = `${contextPrompt}\nUser: ${message}\nAssistant:`;
    console.log('Calling Gemini with prompt length:', prompt.length);
    const response = await model.generateContent(prompt);
    // response may be in different shape depending on SDK; try to extract text
    const reply = response?.response?.text ? response.response.text() : (response?.candidates?.[0]?.content || JSON.stringify(response));
    console.log('Gemini reply length:', reply.length);

    // Update log with reply
    log.reply = reply;
    await log.save();

    // Optionally, you could parse actions from the reply and call internal APIs (not implemented here)

    res.json({ reply, id: log._id });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
};

export default { handleChat };
