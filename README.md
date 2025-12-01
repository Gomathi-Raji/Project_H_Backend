we🏨 Hostel Management System

A responsive web application built with React, Tailwind CSS, and Vite to manage hostel operations efficiently.
This project provides a user-friendly interface for students, administrators, and staff to manage rooms, tenants, and payments.

🚀 Features

🏠 Dashboard: View occupancy, payments, and room status

👤 Tenant Management: Add, edit, and remove tenants

🛏️ Room Management: Track room availability and occupancy

💰 Payment Tracking: Record and monitor payments

📱 Responsive Design: Works on desktop, tablet, and mobile

✨ Modern UI/UX: Built with Tailwind CSS for a clean and intuitive interface

🛠 Technologies Used
Technology	Description
⚛️ React	Frontend library for building UI
🎨 Tailwind CSS	Utility-first CSS framework for styling
🖥️ HTML & CSS	Markup and basic styling
💻 JavaScript	Dynamic functionality
⚡ Vite	Fast build tool and development server
🏷️ Lucide React	Icons used in UI components
🗂️ Git & GitHub	Version control and code hosting

## Connecting the frontend to the backend (development)

This project includes a small API client helper at `src/lib/apiClient.js` which talks to a backend API base (defaults to `/api`). During development the Vite dev server proxies `/api` to `http://localhost:5000` (see `vite.config.js`).

- Start the backend server (from `backend/`):

```powershell
cd backend
Copy-Item .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

- Start the frontend (root):

```powershell
npm install
npm run dev
```

Example usage in components/pages:

```js
import apiFetch from '@/lib/apiClient';

// GET /api/tenants
const tenants = await apiFetch('/tenants');

// POST /api/auth/login
const res = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
```

