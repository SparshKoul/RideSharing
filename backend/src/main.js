/**
 * Main server entry point
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { getLogger } from './config/index.js';
import supabase from './utils/db.js';
import authRouter from './routes/auth.js';
import ridesRouter from './routes/rides.js';
import paymentRouter from './routes/payments.js';
import driverRouter from './routes/drivers.js';
import analyticsRouter from './routes/analytics.js';
import catalogRouter from './routes/catalog.js';
import stateRouter from './routes/state.js';

const logger = getLogger();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 5000,
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/rides', ridesRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api', catalogRouter);
app.use('/api/state', stateRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'RidePlatform Backend' });
});

// Error handler
app.use((err, _req, res, _next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`RidePlatform backend running on http://localhost:${PORT}`);
});