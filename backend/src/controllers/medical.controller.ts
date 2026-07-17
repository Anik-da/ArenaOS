import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { medicalService } from '../services/medical.service';
import { MedicalRepository } from '../repositories/specialized.repository';
import ApiResponse from '../utilities/apiResponse';

export class MedicalController {
  async createCase(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await medicalService.createCase(req.body);
      return ApiResponse.success(res, result, 'Medical emergency reported.', 201);
    } catch (e) { return next(e); }
  }

  async dispatchAmbulance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await medicalService.dispatchAmbulance(req.body);
      return ApiResponse.success(res, result, 'Ambulance dispatched successfully.');
    } catch (e) { return next(e); }
  }

  async assignDoctor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await medicalService.assignDoctor(req.body);
      return ApiResponse.success(res, result, 'Doctor assigned successfully.');
    } catch (e) { return next(e); }
  }

  async updatePatientStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const { status } = req.body;
      const result = await medicalService.updatePatientStatus(caseId, status);
      return ApiResponse.success(res, result, 'Patient status updated.');
    } catch (e) { return next(e); }
  }

  async getPatientQueue(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await medicalService.getPatientQueue(stadiumId);
      return ApiResponse.success(res, result, 'Patient queue retrieved.');
    } catch (e) { return next(e); }
  }

  async getResponseMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await medicalService.getResponseMetrics(stadiumId);
      return ApiResponse.success(res, result, 'Response time metrics retrieved.');
    } catch (e) { return next(e); }
  }

  async listCases(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stadiumId = req.query.stadiumId as string;
      const status = req.query.status as string;
      const limit = parseInt(req.query.limit as string) || 20;

      const filters: any[] = [];
      if (stadiumId) filters.push({ field: 'stadiumId', op: '==', value: stadiumId });
      if (status) filters.push({ field: 'status', op: '==', value: status });

      const result = await MedicalRepository.queryAdvanced({
        filters,
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
        limit,
      });

      return ApiResponse.success(res, result.results, 'Medical cases retrieved.', 200, {
        total: result.total,
        hasNext: result.hasNext,
      });
    } catch (e) { return next(e); }
  }
}

export const medicalController = new MedicalController();
