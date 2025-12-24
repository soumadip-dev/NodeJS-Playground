import type { NextFunction, Request, Response, RequestHandler } from 'express';

// Custome error class
class APIError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError'; // Set the error type to APIError
  }
}

function asyncHandler(fn: RequestHandler): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Global Error Handler
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // log the error stack

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      status: 'Error',
      message: err.message,
    });
  }

  // suppose handle mongoose validation
  else if (err.name === 'validationError') {
    return res.status(err.statusCode).json({
      status: 'error',
      message: 'validationError',
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected error occured',
    });
  }
};

export { APIError, asyncHandler, globalErrorHandler };
