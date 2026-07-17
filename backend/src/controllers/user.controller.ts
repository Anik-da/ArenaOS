import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { UserRepository, SettingRepository, NotificationRepository } from '../repositories/specialized.repository';
import ApiResponse from '../utilities/apiResponse';

export class UserController {
  /**
   * Get authenticated user profile details
   */
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserRepository.getById(req.user!.id);
      return ApiResponse.success(res, user, 'Profile retrieved successfully.');
    } catch (e) {
      return next(e);
    }
  }

  /**
   * Update authenticated user profile fields
   */
  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await UserRepository.update(req.user!.id, req.body);
      return ApiResponse.success(res, null, 'Profile updated successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export class SettingController {
  /**
   * Create or update system configurations
   */
  async updateSetting(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { key, value } = req.body;
      await SettingRepository.create({ id: key, key, value });
      return ApiResponse.success(res, null, 'Settings updated successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export class NotificationController {
  /**
   * Retrieve notification feed for authenticated user with pagination and chronological sorting
   */
  async listUserFeed(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      
      const queryResult = await NotificationRepository.queryAdvanced({
        filters: [{ field: 'userId', op: '==', value: req.user!.id }],
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
        limit,
      });

      return ApiResponse.success(
        res,
        queryResult.results,
        'Notification feed retrieved successfully.',
        200,
        {
          limit,
          total: queryResult.total,
          hasNext: queryResult.hasNext,
        }
      );
    } catch (e) {
      return next(e);
    }
  }
}

export const userController = new UserController();
export const settingController = new SettingController();
export const notificationController = new NotificationController();
