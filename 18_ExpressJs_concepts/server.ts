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

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

// Built-in and custom middlewares
app.use(express.json()); // Express JSON body parser
app.use(configureCors()); // CORS configuration
app.use(requestLogger); // Logs incoming requests 📋
app.use(addTimeStamp); // Adds timestamp to request 🕒
app.use(globalErrorHandler); // Global error handler 🚨

// API versioning middlewares
app.use('/api/v1', validateApiVersionFromUrl('v1'));
// app.use(validateApiVersionFromHeader('v1'));
// app.use(validateApiVersionFromContentType('v1'));

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
