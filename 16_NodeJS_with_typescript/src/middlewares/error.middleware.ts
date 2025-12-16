import type { NextFunction, Request, Response } from 'express';
import type { ErrorResponse } from '../interfaces/error-response.js';
import { ENV } from '../config/env.config.js';

// Middleware to handle 404 (Not Found) routes
export function notFound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404);
  const error = new Error(`Route not found: ${req.originalUrl} ❌`);
  next(error);
}

// Global error-handling middleware
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) {
  // Use existing status code or fallback to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  const response: ErrorResponse = {
    message: err.message,
    success: false,
    errors:
      ENV.NODE_ENV === 'production'
        ? undefined
        : [err.stack || ''],
  };

  res.json(response);
}

/*
Note:
A parameter prefixed with an underscore (e.g. _next)
indicates that the argument is required by the function
signature but intentionally not used in the implementation.
*/
