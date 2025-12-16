import type { Express, NextFunction, Request, Response } from 'express';

import type { MessageResponse } from './interfaces/message-response.js';
import type { ErrorResponse } from './interfaces/error-response.js';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import * as errorMiddlewares from './middlewares/error.middleware.js';
import { ENV } from './config/env.config.js';
import { connectDb } from './database/db.js';
import { IUser, User } from './models/User.model.js';

const app: Express = express();
const PORT = ENV.PORT;

// Global middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Extend Request interface to store request metadata
interface CustomRequest extends Request {
  startTime?: number;
}

// Middleware to track request start time
app.use((req: CustomRequest, _res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
});

// Home route
app.get('/', (_req: Request, res: Response<MessageResponse>) => {
  res.status(200).json({
    message: 'Home route is running ✅',
    success: true,
  });
});

// Example request typing
// Request<Params, ResponseBody, RequestBody, Query>

// User payload interface
interface UserPayload {
  name: string;
  email: string;
  age: number;
}

// Create user route
app.post(
  '/user',
  async (
    req: Request<{}, {}, UserPayload>,
    res: Response<MessageResponse<IUser> | ErrorResponse>
  ) => {
    try {
      const { name, email, age } = req.body;

      const newUser: IUser = await User.create({ name, email, age });

      res.status(201).json({
        message: `User created successfully: ${name} (${email}) 🎉`,
        success: true,
        data: newUser,
      });
    } catch (error) {
      console.error('Error creating user 😏:', error);

      const response: ErrorResponse = {
        message:
          error instanceof Error ? error.message || 'Something went wrong ❌' : 'Unknown error ❌',
        success: false,
      };

      res.status(500).json(response);
    }
  }
);

// Route params interface
interface UserParams {
  id: string;
}

// Get user by ID
app.get(
  '/user/:id',
  (req: Request<UserParams>, res: Response<MessageResponse<{ userId: string }>>) => {
    const { id } = req.params;

    res.status(200).json({
      message: `User found successfully 👤`,
      success: true,
      data: {
        userId: id,
      },
    });
  }
);

// Error handling middlewares
app.use(errorMiddlewares.notFound);
app.use(errorMiddlewares.errorHandler);

const startServer = async () => {
  await connectDb();
  // Start the server
  const server = app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT} 🌐`);
  });

  // Handle server-level errors
  server.on('error', error => {
    if ('code' in error && error.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Please stop the running process or use a different port ⚠️`
      );
    } else {
      console.error('Failed to start the server ❌', error);
    }
    process.exit(1);
  });
};
startServer();
