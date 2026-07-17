import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { StadiumRepository } from '../repositories/specialized.repository';
import { parkingService } from '../services/parking.service';
import { weatherService } from '../services/weather.service';
import ApiResponse from '../utilities/apiResponse';

export class StadiumController {
  /**
   * Create a new stadium configuration in system DB
   */
  async createStadium(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await StadiumRepository.create({
        ...req.body,
        smartSensorsConnected: 250,
      });
      return ApiResponse.success(res, result, 'Stadium created successfully.', 201);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * Fetch static physical stadium specifications
   */
  async getStadiumDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await StadiumRepository.getById(stadiumId);
      return ApiResponse.success(res, result, 'Stadium details retrieved successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export class ParkingController {
  /**
   * Register gate check-in vehicle entry
   */
  async enterVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId, slotId, vehiclePlate } = req.body;
      const result = await parkingService.registerVehicleEntry(stadiumId, slotId, vehiclePlate);
      return ApiResponse.success(res, result, 'Vehicle entry recorded successfully.');
    } catch (e) {
      return next(e);
    }
  }

  /**
   * Register vehicle exit and calculate parking fees
   */
  async exitVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId, slotId } = req.body;
      const result = await parkingService.registerVehicleExit(stadiumId, slotId);
      return ApiResponse.success(res, result, 'Vehicle exit recorded successfully.');
    } catch (e) {
      return next(e);
    }
  }

  /**
   * Retrieve total statistics for parking lot sectors
   */
  async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.query;
      const result = await parkingService.getParkingAnalytics(String(stadiumId || 'stadium_main_1'));
      return ApiResponse.success(res, result, 'Parking analytics compiled successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export class CrowdController {
  /**
   * Compile simulated current sector occupancy flow density
   */
  async getDensity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const zones = ['Sector A', 'Sector B', 'Sector C', 'Sector D', 'VIP Box'];
      const data = zones.map((name) => ({
        zoneId: name.toLowerCase().replace(' ', '_'),
        name,
        currentDensity: Math.floor(45 + Math.random() * 50),
        timestamp: new Date(),
      }));
      return ApiResponse.success(res, data, 'Crowd sector density retrieved successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export class WeatherController {
  /**
   * Retrieve live weather conditions from OpenWeather/simulation
   */
  async getLiveWeather(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.query;
      const result = await weatherService.fetchLiveStadiumWeather(String(stadiumId || 'stadium_main_1'));
      return ApiResponse.success(res, result, 'Live weather telemetry retrieved successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export class TwinController {
  /**
   * Retrieve Digital Twin physical layered status sync specs
   */
  async getTwinState(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(
        res,
        {
          stadiumId: 'stadium_main_1',
          layersConnected: ['gates', 'parking', 'cameras', 'drones', 'utility'],
          systemLoadPct: parseFloat((55 + Math.random() * 20).toFixed(1)),
          telemetryStatus: 'nominal',
        },
        'Digital Twin telemetry state synced successfully.'
      );
    } catch (e) {
      return next(e);
    }
  }
}

export const stadiumController = new StadiumController();
export const parkingController = new ParkingController();
export const crowdController = new CrowdController();
export const weatherController = new WeatherController();
export const twinController = new TwinController();
