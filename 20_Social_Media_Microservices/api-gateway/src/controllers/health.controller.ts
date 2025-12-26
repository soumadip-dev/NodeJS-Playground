import type { Request, Response } from 'express';
import type { MessageResponse } from '../interfaces/message-response';

export const healthCheck = (
  req: Request,
  res: Response<MessageResponse>
) => {
  res.status(200).json({
    message: 'API is running smoothly ✅',
    success: true,
  });
};
