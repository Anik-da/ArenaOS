import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { StadiumRepository } from '../repositories/specialized.repository';
import ApiResponse from '../utilities/apiResponse';

export class StadiumController {
  /** Create a new stadium configuration */
  async createStadium(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await StadiumRepository.create({
        ...req.body,
        smartSensorsConnected: req.body.smartSensorsConnected || 250,
      });
      return ApiResponse.success(res, result, 'Stadium created successfully.', 201);
    } catch (e) { return next(e); }
  }

  /** Fetch a specific stadium by ID */
  async getStadiumDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await StadiumRepository.getById(stadiumId);
      if (!result) {
        return ApiResponse.error(res, 'Stadium not found.', 404);
      }
      return ApiResponse.success(res, result, 'Stadium details retrieved successfully.');
    } catch (e) { return next(e); }
  }

  /** List all stadiums in the system */
  async listStadiums(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await StadiumRepository.getAll();
      return ApiResponse.success(res, result, 'Stadium list retrieved successfully.');
    } catch (e) { return next(e); }
  }

  /** Update a stadium configuration */
  async updateStadium(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const success = await StadiumRepository.update(stadiumId, req.body);
      if (!success) {
        return ApiResponse.error(res, 'Stadium not found or not modified.', 404);
      }
      return ApiResponse.success(res, { id: stadiumId, ...req.body }, 'Stadium updated successfully.');
    } catch (e) { return next(e); }
  }

  /** Delete a stadium configuration */
  async deleteStadium(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const success = await StadiumRepository.delete(stadiumId);
      if (!success) {
        return ApiResponse.error(res, 'Stadium not found.', 404);
      }
      return ApiResponse.success(res, { id: stadiumId }, 'Stadium deleted successfully.');
    } catch (e) { return next(e); }
  }
}

export const stadiumController = new StadiumController();
