import dotenv from 'dotenv';

dotenv.config();

// Allowed Node.js environments
type NodeEnv = 'development' | 'production' | 'test';

const port = Number(process.env.PORT);

// Centralized environment configuration
export const ENV: {
  PORT: number;
  NODE_ENV: NodeEnv;
} = {
  PORT: Number.isNaN(port) ? 8080 : port,

  NODE_ENV:
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'test'
      ? process.env.NODE_ENV
      : 'development',
};
