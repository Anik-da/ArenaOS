import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { emergencyService } from '../services/emergency.service';
import ApiResponse from '../utilities/apiResponse';

export class EmergencyController {
  /** Create a new emergency alert */
  async createAlert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await emergencyService.createAlert(req.body);
      return ApiResponse.success(res, result, 'Emergency alert created.', 201);
    } catch (e) { return next(e); }
  }

  /** List all emergency alerts */
  async listAlerts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const severity = req.query.severity as string;
      const filters: any[] = [];
      if (severity) filters.push({ field: 'severity', op: '==', value: severity });
      const result = await emergencyService.listAlerts({ filters, limit, orderBy: [{ field: 'timestamp', direction: 'desc' }] });
      return ApiResponse.success(res, result.results, 'Alerts retrieved.', 200, { total: result.total, hasNext: result.hasNext });
    } catch (e) { return next(e); }
  }

  /** Get active emergency alerts */
  async getActiveAlerts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await emergencyService.getActiveAlerts();
      return ApiResponse.success(res, result, 'Active alerts retrieved.');
    } catch (e) { return next(e); }
  }

  /** Update an emergency alert */
  async updateAlert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { alertId } = req.params;
      await emergencyService.updateAlert(alertId, req.body);
      return ApiResponse.success(res, { id: alertId }, 'Alert updated.');
    } catch (e) { return next(e); }
  }

  /** Broadcast an emergency alert via Socket.IO */
  async broadcastAlert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { alertId } = req.params;
      const result = await emergencyService.broadcastAlert(alertId);
      return ApiResponse.success(res, result, 'Alert broadcasted.');
    } catch (e) { return next(e); }
  }

  /** Handle SOS from fans */
  async handleSOS(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = { ...req.body, userId: req.user!.id };
      const result = await emergencyService.handleSOS(data);
      return ApiResponse.success(res, result, 'SOS received and dispatched.', 201);
    } catch (e) { return next(e); }
  }
}

export const emergencyController = new EmergencyController();
