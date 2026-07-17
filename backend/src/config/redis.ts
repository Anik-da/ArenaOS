import Redis from 'ioredis';
import logger from '../utilities/logger';

let redisClient: any;
let isRedisMock = false;

try {
  const host = process.env.REDIS_HOST || 'localhost';
  const port = parseInt(process.env.REDIS_PORT || '6379');
  const password = process.env.REDIS_PASSWORD || undefined;

  // Set timeout to avoid blocking startup if Redis is down
  redisClient = new Redis({
    host,
    port,
    password,
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
  });

  redisClient.on('connect', () => {
    logger.info('Connected to Redis server successfully.');
  });

  redisClient.on('error', (err: any) => {
    logger.warn(`Redis client error: ${err.message}. Initializing Mock Redis In-Memory Client.`);
    fallbackToMock();
  });
} catch (error: any) {
  logger.warn(`Redis initialization threw error: ${error.message}. Initializing Mock Redis Client.`);
  fallbackToMock();
}

function fallbackToMock() {
  isRedisMock = true;
  const store: Record<string, string> = {};

  redisClient = {
    async get(key: string) {
      return store[key] || null;
    },
    async set(key: string, value: string, _mode?: string, _duration?: number) {
      store[key] = value;
      return 'OK';
    },
    async del(key: string) {
      delete store[key];
      return 1;
    },
    async keys(pattern: string) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return Object.keys(store).filter(k => regex.test(k));
    },
    async flushall() {
      Object.keys(store).forEach(k => delete store[k]);
      return 'OK';
    }
  };
}

export { redisClient, isRedisMock };
export default redisClient;
