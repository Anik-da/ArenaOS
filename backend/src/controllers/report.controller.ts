import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { reportService } from '../services/report.service';
import ApiResponse from '../utilities/apiResponse';

export class ReportController {
  async generate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { type, format, stadiumId, tournamentId } = req.body;
      const result = await reportService.generateReport(type, format, {
        stadiumId,
        tournamentId,
        actorId: req.user!.id
      });
      return ApiResponse.success(res, result, 'Report compiled successfully.', 201);
    } catch (e) { return next(e); }
  }

  async listReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as string;
      const format = req.query.format as string;
      const limit = parseInt(req.query.limit as string) || 20;

      const filters: any[] = [];
      if (type) filters.push({ field: 'type', op: '==', value: type });
      if (format) filters.push({ field: 'format', op: '==', value: format });

      const result = await reportService.listReports({
        filters,
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
        limit,
      });

      return ApiResponse.success(res, result.results, 'Report index list retrieved.', 200, {
        total: result.total,
        hasNext: result.hasNext
      });
    } catch (e) { return next(e); }
  }

  async downloadReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;
      const report = await reportService.getReportById(reportId);
      if (!report) {
        return ApiResponse.error(res, 'Report not found.', 404);
      }
      return ApiResponse.success(res, { url: report.fileUrl }, 'Download link ready.');
    } catch (e) { return next(e); }
  }
}

export const reportController = new ReportController();
