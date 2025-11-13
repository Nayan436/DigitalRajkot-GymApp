import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import planRoutes from './routes/plans';
import attendanceRoutes from './routes/attendance';
import expenseRoutes from './routes/expenses';
import reportRoutes from './routes/reports';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
});
app.use('/api/auth/login', loginLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', authMiddleware, memberRoutes);
app.use('/api/plans', authMiddleware, planRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// Seed data on first run
import { seedData } from './models/storage';
seedData().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
