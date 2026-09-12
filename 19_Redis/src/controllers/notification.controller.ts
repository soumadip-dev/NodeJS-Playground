import { Request, Response, NextFunction } from 'express';
import { NotificationPayload, publishNotification } from '../subscribers/notification.subscribers';

export async function publishNotificationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, message } = req.body;

    // Validate the required notification fields before publishing.
    if (
      typeof title !== 'string' ||
      typeof message !== 'string' ||
      !title.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required.',
      });
    }

    const notification: NotificationPayload = {
      id: Date.now().toString(),
      title: title.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // Publish the notification to Redis so that subscribed clients
    // can receive and process it.
    await publishNotification(notification);

    return res.status(201).json({
      success: true,
      message: 'Notification published successfully.',
      data: {
        id: notification.id,
      },
    });
  } catch (error) {
    next(error);
  }
}
