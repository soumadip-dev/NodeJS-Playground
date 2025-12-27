import type { Express, NextFunction, Request, Response } from 'express';
import type { MessageResponse } from './interfaces/message-response.js';

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.routes.js';
import configureCors from './config/cors.config.js';
import logger from './utils/logger.utils.js';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { ENV } from './config/env.config.js';

const app: Express = express();

const redisClient = new Redis(ENV.REDIS_URL); //A connection is established to a Redis server using ioredis.

// Global middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(configureCors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body: ${req.body}`);
  next();
});

// DDOS protection and rate limiting
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient, // Tells the rate limiter to store data in Redis
  keyPrefix: 'middleware',
  points: 10, //Number of allowed requests
  duration: 1, // Time window in seconds
});

app.use((req: Request, res: Response<MessageResponse>, next: NextFunction) => {
  const ip = req.ip ?? 'unknown-ip';

  rateLimiter
    .consume(ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      res.status(429).json({ success: false, message: 'Too many requests' });
    });
});

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
