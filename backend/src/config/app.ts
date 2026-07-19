import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const randomSecret = crypto.randomBytes(32).toString('hex');
const randomRefreshSecret = crypto.randomBytes(32).toString('hex');

export const config = {
  port: parseInt(process.env.PORT || '5000'),
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || randomSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || randomRefreshSecret,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  ai: {
    geminiKey: process.env.GEMINI_API_KEY || '',
    openaiKey: process.env.OPENAI_API_KEY || '',
    huggingfaceToken: process.env.HUGGINGFACE_TOKEN || '',
  },
  weather: {
    apiKey: process.env.OPENWEATHER_API_KEY || '',
  }
};

export default config;
