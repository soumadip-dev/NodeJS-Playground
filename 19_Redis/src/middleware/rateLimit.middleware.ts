import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../redis/client';

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 10;

export async function productRateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Each IP address gets its own request counter in Redis.
    // Example:
    // rate_limit:products:127.0.0.1
    //
    // This ensures that one client exceeding the rate limit
    // does not block other clients.

    // In production, make sure Express is configured correctly
    // when the application runs behind a reverse proxy or load balancer.
    const ipAddress = req.ip || 'unknown';

    const rateLimitKey = `rate_limit:products:${ipAddress}`;

    // Increment the request counter for this IP address.
    const requestCount = await redisClient.incr(rateLimitKey);

    // Set the expiration only when the key is created.
    // After the window expires, Redis removes the key and
    // the request counter starts again from zero.
    if (requestCount === 1) {
      await redisClient.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS);
    }

    // Add rate-limit information to the response headers.
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestCount));

    // Reject the request when the client exceeds the limit.
    if (requestCount > RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
    }

    return next();
  } catch (error) {
    console.error('Product rate limit middleware error:', error);
    return next(error);
  }
}
