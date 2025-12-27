import dotenv from 'dotenv';
dotenv.config();

type NodeEnv = 'development' | 'production' | 'test';

const port = Number(process.env.PORT) || 8080;
const nodeEnv: NodeEnv = ['development', 'production', 'test'].includes(process.env.NODE_ENV || '')
  ? (process.env.NODE_ENV as NodeEnv)
  : 'development';
const mongoUri = process.env.MONGO_URI || '';
const jwtSecret = process.env.JWT_SECRET || '';
const frontendurl = process.env.FRONTEND_URL || '';
const redisurl = process.env.REDIS_URL || '';

export const ENV = {
  PORT: port,
  NODE_ENV: nodeEnv,
  MONGO_URI: mongoUri,
  JWT_SECRET: jwtSecret,
  FRONTEND_URL: frontendurl,
  REDIS_URL: redisurl,
};
