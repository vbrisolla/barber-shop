import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import servicesRoutes from './routes/services';
import barbersRoutes from './routes/barbers';
import appointmentsRoutes from './routes/appointments';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/barbers', barbersRoutes);
app.use('/api/appointments', appointmentsRoutes);

app.use(errorHandler);

export default app;
