import React, { useState, useRef, useEffect } from 'react';
import apiFetch from '@/lib/apiClient';

export default function Chatbot() {
  const [role, setRole] = useState('tenant');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I\'m your Hostel Management Assistant.\n\nThis is a comprehensive hostel management system where tenants can manage their stays, payments, and requests, while admins oversee operations, approvals, and maintenance.'
    }
  ]);
  const [input, setInput] = useState('');
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    try {
      // send message to backend chat endpoint
      const res = await apiFetch('/chat', { method: 'POST', body: { message: input, role } });
      setMessages((m) => [...m, { sender: 'bot', text: res.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { sender: 'bot', text: 'Error: ' + (err.message || 'Failed to get reply') }]);
    }
    setInput('');
  };

  return (
  <div className="chat-container p-6 bg-card rounded-2xl max-w-lg mx-auto">
      <div className="flex justify-between mb-2">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded">
          <option value="tenant">Tenant</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div ref={boxRef} className="chat-box h-96 overflow-y-auto p-4 border rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`my-2 ${msg.sender === 'user' ? 'text-blue-600' : 'text-green-700'}`}>
            <b>{msg.sender === 'user' ? 'You' : 'Bot'}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 p-2 border rounded" />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
