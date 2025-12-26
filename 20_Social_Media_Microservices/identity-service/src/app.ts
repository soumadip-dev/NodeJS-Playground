import type { Express, Request, Response } from 'express';
import type { MessageResponse } from './interfaces/message-response.js';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.routes.js';

const app: Express = express();

// Global middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req: Request, res: Response<MessageResponse>) => {
  res.status(200).json({
    message: 'Home route is running 🏚️',
    success: true,
  });
});

// Health check routes
app.use('/api/health', healthRoutes);

export default app;
