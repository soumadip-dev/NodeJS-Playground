import 'express';

declare global {
  namespace Express {
    interface Request {
      timeStamp: string;
    }
  }
}
