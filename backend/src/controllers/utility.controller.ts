import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { utilityService } from '../services/utility.service';
import ApiResponse from '../utilities/apiResponse';

export class UtilityController {
  async getEnergy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await utilityService.trackLiveEnergy(stadiumId);
      return ApiResponse.success(res, result, 'Live energy state retrieved.');
    } catch (e) { return next(e); }
  }

  async getWater(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await utilityService.trackLiveWater(stadiumId);
      return ApiResponse.success(res, result, 'Live water state retrieved.');
    } catch (e) { return next(e); }
  }

  async getEnergyAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const limit = parseInt(req.query.limit as string) || 30;
      const result = await utilityService.getEnergyAnalytics(stadiumId, limit);
      return ApiResponse.success(res, result, 'Energy usage analytics retrieved.');
    } catch (e) { return next(e); }
  }

  async getWaterAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const limit = parseInt(req.query.limit as string) || 30;
      const result = await utilityService.getWaterAnalytics(stadiumId, limit);
      return ApiResponse.success(res, result, 'Water usage analytics retrieved.');
    } catch (e) { return next(e); }
  }

  async reportLeak(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const { sector, severity } = req.body;
      const result = await utilityService.reportLeak(stadiumId, sector, severity);
      return ApiResponse.success(res, result, 'Leak status reported successfully.', 201);
    } catch (e) { return next(e); }
  }
}

export const utilityController = new UtilityController();
