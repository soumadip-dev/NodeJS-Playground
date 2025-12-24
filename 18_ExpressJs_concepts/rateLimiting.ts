import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

const createRateLimiter = (maxRequests: number, time: number): RateLimitRequestHandler => {
  return rateLimit({
    max: maxRequests,
    windowMs: time,
    message: 'Too many requests. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export { createRateLimiter };
