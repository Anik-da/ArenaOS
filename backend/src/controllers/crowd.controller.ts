import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { CrowdRepository, CrowdZoneRepository } from '../repositories/specialized.repository';
import { crowdService } from '../services/crowd.service';
import ApiResponse from '../utilities/apiResponse';

export class CrowdController {
  /** Report crowd density for a specific zone */
  async reportDensity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await crowdService.reportDensity(req.body);
      return ApiResponse.success(res, result, 'Crowd density reported.', 201);
    } catch (e) { return next(e); }
  }

  /** Get current crowd density for all zones in a stadium */
  async getCurrentDensity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await crowdService.getCurrentDensity(stadiumId);
      return ApiResponse.success(res, result, 'Current density retrieved.');
    } catch (e) { return next(e); }
  }

  /** Get crowd density history for a specific zone */
  async getZoneHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId, zoneId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await crowdService.getZoneHistory(stadiumId, zoneId, limit);
      return ApiResponse.success(res, result, 'Zone history retrieved.');
    } catch (e) { return next(e); }
  }

  /** Get active surge alerts */
  async getSurgeAlerts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await crowdService.detectSurge(stadiumId);
      return ApiResponse.success(res, result, 'Surge alerts retrieved.');
    } catch (e) { return next(e); }
  }

  /** List all crowd zones for a stadium */
  async listZones(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const zones = await CrowdZoneRepository.query('stadiumId', '==', stadiumId);
      return ApiResponse.success(res, zones, 'Crowd zones retrieved.');
    } catch (e) { return next(e); }
  }
}

export const crowdController = new CrowdController();
