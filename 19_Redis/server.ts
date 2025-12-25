import type { Express, Request, Response } from 'express';

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

app.use(express.json()); // Express JSON body parser
app.use(cors()); // CORS configuration

// Home route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Home route is running ✅',
    success: true,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT} 🌐`);
});
