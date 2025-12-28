import type { MessageResponse } from './interfaces/message-response';
import type { ErrorResponse } from './interfaces/error-response';

import express, { type Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import RedisStore from 'rate-limit-redis';

import healthRoutes from './routes/health.routes.js';
import identityRoutes from './routes/identity.routes';
import configureCors from './config/cors.config.js';
import logger from './utils/logger.utils.js';
import { ENV } from './config/env.config.js';
import errorHandler from './middlewares/error.middlewares';

const app: Express = express();

const redisClient = new Redis(ENV.REDIS_URL); // Connection is established to a Redis server using ioredis.

// Ip based rate limiting for sensitive endpoints
const sensitiveEndpointsLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response<ErrorResponse>) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip} 🚫`);
    res.status(429).json({ message: 'Too many request', success: false });
  },
  store: new RedisStore({
    // @ts-expect-error
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
});

// Global middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(configureCors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received ${req.method} request to ${req.url} 📨`);
  logger.info(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

// DDOS protection and rate limiting using rate-limiter-flexible
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient, // Tells the rate limiter to store data in Redis
  keyPrefix: 'middleware',
  points: 10, //Number of allowed requests
  duration: 1, // Time window in seconds
});

app.use((req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const ip = req.ip ?? 'unknown-ip';

  rateLimiter
    .consume(ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${ip} ⚠️`);
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

// apply the sensetiveEndPointLimiter to our routes
app.use('/api/auth/register', sensitiveEndpointsLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', identityRoutes);

app.use(errorHandler);

export default app;
