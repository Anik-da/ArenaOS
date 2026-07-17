import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { settingsService } from '../services/settings.service';
import ApiResponse from '../utilities/apiResponse';

export class SettingsController {
  async get(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const result = await settingsService.get(key);
      return ApiResponse.success(res, result, 'Setting retrieved.');
    } catch (e) { return next(e); }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await settingsService.update(req.body);
      return ApiResponse.success(res, result, 'Setting updated.');
    } catch (e) { return next(e); }
  }

  async bulkUpdate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { settings } = req.body;
      const result = await settingsService.bulkUpdate(settings);
      return ApiResponse.success(res, result, 'Settings updated in bulk.');
    } catch (e) { return next(e); }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await settingsService.list();
      return ApiResponse.success(res, result, 'All configurations retrieved.');
    } catch (e) { return next(e); }
  }
}

export const settingsController = new SettingsController();
