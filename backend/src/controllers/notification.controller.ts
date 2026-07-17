import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { notificationService } from '../services/notification.service';
import ApiResponse from '../utilities/apiResponse';

export class NotificationController {
  async send(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.send(req.body);
      return ApiResponse.success(res, result, 'Notification sent.', 201);
    } catch (e) { return next(e); }
  }

  async broadcast(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.broadcast(req.body);
      return ApiResponse.success(res, result, 'Broadcast notification queued.');
    } catch (e) { return next(e); }
  }

  async getUserNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await notificationService.getUserNotifications(userId, {
        filters: [{ field: 'userId', op: '==', value: userId }],
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
        limit,
      });

      return ApiResponse.success(res, result.results, 'Notifications retrieved.', 200, {
        total: result.total,
        hasNext: result.hasNext,
      });
    } catch (e) { return next(e); }
  }

  async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { notificationIds } = req.body;
      await notificationService.markRead(notificationIds);
      return ApiResponse.success(res, null, 'Notifications marked as read.');
    } catch (e) { return next(e); }
  }

  async markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      await notificationService.markAllRead(userId);
      return ApiResponse.success(res, null, 'All notifications marked as read.');
    } catch (e) { return next(e); }
  }
}

export const notificationController = new NotificationController();
