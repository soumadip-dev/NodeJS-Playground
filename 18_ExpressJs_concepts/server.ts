import type { Express, Request, Response } from 'express';

import express from 'express';
import dotenv from 'dotenv';

import configureCors from './config/cors.config';

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

app.use(express.json()); // express json middleware
app.use(configureCors());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Home route is running ✅',
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT} 🌐`);
});
