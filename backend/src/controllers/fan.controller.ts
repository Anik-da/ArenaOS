import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { fanService } from '../services/fan.service';
import ApiResponse from '../utilities/apiResponse';

export class FanController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await fanService.getProfile(userId);
      return ApiResponse.success(res, result, 'Fan profile retrieved.');
    } catch (e) { return next(e); }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await fanService.updateProfile(userId, req.body);
      return ApiResponse.success(res, result, 'Fan profile updated.');
    } catch (e) { return next(e); }
  }

  async getTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await fanService.getTickets(userId);
      return ApiResponse.success(res, result, 'Fan tickets retrieved.');
    } catch (e) { return next(e); }
  }

  async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await fanService.getOrders(userId);
      return ApiResponse.success(res, result, 'Fan orders retrieved.');
    } catch (e) { return next(e); }
  }

  async getFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await fanService.getFavorites(userId);
      return ApiResponse.success(res, result, 'Favorite selections retrieved.');
    } catch (e) { return next(e); }
  }

  async sendSOS(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await fanService.sendSOS(userId, req.body);
      return ApiResponse.success(res, result, 'SOS alert dispatched immediately.', 201);
    } catch (e) { return next(e); }
  }
}

export const fanController = new FanController();
