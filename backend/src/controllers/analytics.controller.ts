import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { analyticsService } from '../services/analytics.service';
import { reportService } from '../services/report.service';
import { cacheService } from '../services/cache.service';
import ApiResponse from '../utilities/apiResponse';

export class AnalyticsController {
  /**
   * Get stadium control console analytics with 30 seconds caching to speed up dashboard loads
   */
  async getConsoleStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stadiumId = String(req.query.stadiumId || 'stadium_main_1');
      const cacheKey = `analytics:console:${stadiumId}`;

      // Check cache first
      const cachedStats = await cacheService.get<any>(cacheKey);
      if (cachedStats) {
        return ApiResponse.success(res, cachedStats, 'Stadium console statistics retrieved from cache.');
      }

      const result = await analyticsService.getStadiumDashboardAnalytics(stadiumId);
      
      // Cache analytics for 30 seconds
      await cacheService.set(cacheKey, result, 30);

      return ApiResponse.success(res, result, 'Stadium console statistics compiled successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export class ReportController {
  /**
   * Export daily operations report in PDF, Excel, or CSV format
   */
  async exportReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId, format } = req.body;
      const result = await reportService.generateDailyReport(stadiumId || 'stadium_main_1', format || 'pdf');
      return ApiResponse.success(res, result, 'Report generated successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export const analyticsController = new AnalyticsController();
export const reportController = new ReportController();
