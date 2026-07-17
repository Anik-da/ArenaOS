import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { parkingService } from '../services/parking.service';
import { ParkingRepository } from '../repositories/specialized.repository';
import ApiResponse from '../utilities/apiResponse';

export class ParkingController {
  /** Record vehicle entry */
  async vehicleEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await parkingService.vehicleEntry(req.body);
      return ApiResponse.success(res, result, 'Vehicle entry recorded.', 201);
    } catch (e) { return next(e); }
  }

  /** Record vehicle exit and calculate charges */
  async vehicleExit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await parkingService.vehicleExit(req.body);
      return ApiResponse.success(res, result, 'Vehicle exit processed.');
    } catch (e) { return next(e); }
  }

  /** List parking slots with filtering */
  async listSlots(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const status = req.query.status as string;
      const type = req.query.type as string;
      const limit = parseInt(req.query.limit as string) || 50;

      const filters: any[] = [{ field: 'stadiumId', op: '==', value: stadiumId }];
      if (status) filters.push({ field: 'status', op: '==', value: status });
      if (type) filters.push({ field: 'type', op: '==', value: type });

      const result = await ParkingRepository.queryAdvanced({ filters, limit });
      return ApiResponse.success(res, result.results, 'Parking slots retrieved.', 200, { total: result.total, hasNext: result.hasNext });
    } catch (e) { return next(e); }
  }

  /** Get parking revenue analytics */
  async getRevenue(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await parkingService.getRevenue(stadiumId);
      return ApiResponse.success(res, result, 'Parking revenue retrieved.');
    } catch (e) { return next(e); }
  }

  /** Get parking analytics summary */
  async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await parkingService.getAnalytics(stadiumId);
      return ApiResponse.success(res, result, 'Parking analytics retrieved.');
    } catch (e) { return next(e); }
  }

  /** Get EV charging stations */
  async getEVStations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const slots = await ParkingRepository.query('stadiumId', '==', stadiumId);
      const evSlots = slots.filter((s: any) => s.type === 'ev');
      return ApiResponse.success(res, evSlots, 'EV stations retrieved.');
    } catch (e) { return next(e); }
  }
}

export const parkingController = new ParkingController();
