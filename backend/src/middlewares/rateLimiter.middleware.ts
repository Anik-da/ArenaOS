import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import ApiResponse from '../utilities/apiResponse';

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

/**
 * Creates a rate limiter middleware backed by Redis.
 * Uses atomic Redis operations to track requests per client IP.
 */
export function createRedisRateLimiter(options: RateLimitOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const key = `ratelimit:${req.baseUrl || ''}${req.path}:${ip}`;

      // Retrieve requests count from Redis
      const current = await redisClient.get(key);

      if (current !== null) {
        const requests = parseInt(current, 10);
        if (requests >= options.max) {
          return ApiResponse.error(res, options.message, 429);
        }
        await redisClient.incr(key);
      } else {
        // Set with TTL (seconds) atomically
        const ttlSeconds = Math.max(1, Math.ceil(options.windowMs / 1000));
        await redisClient.set(key, '1', 'EX', ttlSeconds);
      }

      return next();
    } catch (error) {
      // Fail-open: If Redis is unavailable, let the request pass rather than blocking clients
      return next();
    }
  };
}

// 1. General API limit: 100 requests per 15 minutes per IP
export const apiRateLimiter = createRedisRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

// 2. Auth attempts limit: 15 login/register attempts per hour per IP
export const authRateLimiter = createRedisRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: 'Too many authentication attempts. Please try again in an hour.'
});
