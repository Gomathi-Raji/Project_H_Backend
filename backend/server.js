import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import rentRoutes from "./routes/rentRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import vacatingRequestRoutes from "./routes/vacatingRequestRoutes.js";
import exchangeRequestRoutes from "./routes/exchangeRequestRoutes.js";
import setupSwagger from './swagger.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
// Allow frontend origin from env or common dev ports (Vite defaults)
const frontendEnv = process.env.FRONTEND_URL;
const allowedOrigins = frontendEnv
	? frontendEnv.split(",")
	: ["http://localhost:8080", "http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/api/test", (req, res) => res.json({ ok: true, time: new Date() }));

app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rent", rentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/vacating-requests", vacatingRequestRoutes);
app.use("/api/exchange-requests", exchangeRequestRoutes);

// Swagger UI
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
