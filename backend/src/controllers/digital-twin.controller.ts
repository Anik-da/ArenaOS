import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { digitalTwinService } from '../services/digital-twin.service';
import ApiResponse from '../utilities/apiResponse';

export class DigitalTwinController {
  async getState(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await digitalTwinService.getState(stadiumId);
      return ApiResponse.success(res, result, 'Digital Twin state aggregated successfully.');
    } catch (e) { return next(e); }
  }

  async updateLayers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const { layersActive } = req.body;
      const result = await digitalTwinService.updateLayers(stadiumId, layersActive);
      return ApiResponse.success(res, result, 'Digital Twin layers updated.');
    } catch (e) { return next(e); }
  }

  async getSeatMap(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const zone = req.query.zone as string;
      const result = await digitalTwinService.getSeatMap(stadiumId, zone);
      return ApiResponse.success(res, result, 'Seat map retrieved.');
    } catch (e) { return next(e); }
  }

  async updateSeatMap(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const { zone, updates } = req.body;
      const result = await digitalTwinService.updateSeatMap(stadiumId, zone, updates);
      return ApiResponse.success(res, result, 'Seat map status updated.');
    } catch (e) { return next(e); }
  }

  async getGateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await digitalTwinService.getGateStatus(stadiumId);
      return ApiResponse.success(res, result, 'Gate status overview retrieved.');
    } catch (e) { return next(e); }
  }

  async updateGateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const { gateId, status } = req.body;
      const result = await digitalTwinService.updateGateStatus(stadiumId, gateId, status);
      return ApiResponse.success(res, result, 'Gate status updated.');
    } catch (e) { return next(e); }
  }

  async getDronePositions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await digitalTwinService.getDronePositions(stadiumId);
      return ApiResponse.success(res, result, 'Drone patrol telemetry retrieved.');
    } catch (e) { return next(e); }
  }

  async getCameraPositions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await digitalTwinService.getCameraPositions(stadiumId);
      return ApiResponse.success(res, result, 'Camera array positions retrieved.');
    } catch (e) { return next(e); }
  }

  async getEmergencyVehicles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await digitalTwinService.getEmergencyVehicles(stadiumId);
      return ApiResponse.success(res, result, 'Emergency responder locations retrieved.');
    } catch (e) { return next(e); }
  }

  async getCrowdZones(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await digitalTwinService.getCrowdZones(stadiumId);
      return ApiResponse.success(res, result, 'Crowd zone aggregates retrieved.');
    } catch (e) { return next(e); }
  }
}

export const digitalTwinController = new DigitalTwinController();
