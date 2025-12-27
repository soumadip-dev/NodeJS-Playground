import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../utils/logger.utils';

// Extend the base Error type to include HTTP status
interface HttpError extends Error {
  status?: number;
}

const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err);

  const statusCode = err.status ?? 500;
  const message = err.message ?? 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
