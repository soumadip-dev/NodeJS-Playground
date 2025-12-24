import type { NextFunction, Request, RequestHandler, Response } from 'express';

const requestLogger: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const timeStamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent');

  console.log(`[${timeStamp}] ${method} ${url} - User-Agent: ${userAgent}`);

  next();
};

const addTimeStamp: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  req.timeStamp = new Date().toISOString();
  next();
};

export { requestLogger, addTimeStamp };
