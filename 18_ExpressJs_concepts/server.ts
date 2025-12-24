import type { Express, Request, Response } from 'express';

import express from 'express';
import dotenv from 'dotenv';

import configureCors from './config/cors.config';
import { addTimeStamp, requestLogger } from './middleware/customeMiddleware';
import { globalErrorHandler } from './middleware/errorHandler';
import {
  validateApiVersionFromUrl,
  validateApiVersionFromHeader,
  validateApiVersionFromContentType,
} from './middleware/apiVersoning';
import { createRateLimiter } from './rateLimiting';
import itemRoutes from './routes/item.routes';

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

app.use(express.json()); // Express JSON body parser
app.use(configureCors()); // CORS configuration
app.use(requestLogger); // Logs incoming requests 📋
app.use(addTimeStamp); // Adds timestamp to request 🕒
app.use(createRateLimiter(100, 15 * 60 * 100)); // 100 request per 15 minutes 🕒

// API versioning middlewares
app.use(validateApiVersionFromUrl('v1'));
// app.use(validateApiVersionFromHeader('v1'));
// app.use(validateApiVersionFromContentType('v1'));

app.use('/api/v1', createRateLimiter(3, 60 * 100), itemRoutes);

app.use(globalErrorHandler); // Global error handler 🚨

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
