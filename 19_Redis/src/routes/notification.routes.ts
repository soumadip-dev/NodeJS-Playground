import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';

const notificationRouter = Router();

notificationRouter.post('/', notificationController.publishNotificationController);

export default notificationRouter;
