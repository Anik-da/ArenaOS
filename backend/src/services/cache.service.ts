import { redisClient, isRedisMock } from '../config/redis';
import logger from '../utilities/logger';

export class CacheService {
  /**
   * Get an item from the cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error: any) {
      logger.warn(`Cache read error for key [${key}]: ${error.message}`);
      return null;
    }
  }

  /**
   * Set an item in the cache with optional TTL in seconds
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        // Mode 'EX' specifies expiry time in seconds
        await redisClient.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await redisClient.set(key, serialized);
      }
      return true;
    } catch (error: any) {
      logger.warn(`Cache write error for key [${key}]: ${error.message}`);
      return false;
    }
  }

  /**
   * Delete an item from the cache
   */
  async del(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error: any) {
      logger.warn(`Cache delete error for key [${key}]: ${error.message}`);
      return false;
    }
  }

  /**
   * Delete keys matching a pattern (e.g. "user:session:*")
   */
  async delPattern(pattern: string): Promise<boolean> {
    try {
      if (isRedisMock) {
        const keys = await redisClient.keys(pattern);
        for (const key of keys) {
          await redisClient.del(key);
        }
        return true;
      }
      
      // For real Redis, scan matches to avoid blocking the main event loop (large sets)
      let cursor = '0';
      do {
        const reply = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = reply[0];
        const keys = reply[1];
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } while (cursor !== '0');
      
      return true;
    } catch (error: any) {
      logger.warn(`Cache invalidation pattern error [${pattern}]: ${error.message}`);
      return false;
    }
  }
}

export const cacheService = new CacheService();
export default cacheService;
