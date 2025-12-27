import type { Request, Response } from 'express';
import type { MessageResponse } from '../interfaces/message-response';
import type { ErrorResponse } from '../interfaces/error-response';

export const healthCheck = (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  res.status(200).json({
    message: 'API is running smoothly ✅',
    success: true,
  });
};
