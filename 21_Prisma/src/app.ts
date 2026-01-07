import dotenv from 'dotenv';

dotenv.config();

import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import type { MessageResponse } from './interfaces/message-response';

import configureCors from './config/cors.config.js';
import healthRoutes from './routes/health.routes.js';
import errorHandler from './middlewares/error.middlewares';

const app: Express = express();

// Global middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(configureCors());
app.use(express.json());

// Home route
app.get('/', (req: Request, res: Response<MessageResponse>) => {
  res.status(200).json({
    success: true,
    message: 'Home route is running',
  });
});

// Routes
app.use('/api/health', healthRoutes);

// Error handler
app.use(errorHandler);

export default app;
