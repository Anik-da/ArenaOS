import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { weatherService } from '../services/weather.service';
import ApiResponse from '../utilities/apiResponse';

export class WeatherController {
  /** Get current weather for a stadium */
  async getCurrentWeather(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await weatherService.fetchLiveStadiumWeather(stadiumId);
      return ApiResponse.success(res, result, 'Current weather retrieved.');
    } catch (e) { return next(e); }
  }

  /** Get weather forecast */
  async getForecast(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const days = parseInt(req.query.days as string) || 5;
      const result = await weatherService.getForecast(stadiumId, days);
      return ApiResponse.success(res, result, 'Forecast retrieved.');
    } catch (e) { return next(e); }
  }

  /** Get active weather alerts */
  async getAlerts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await weatherService.getWeatherAlerts(stadiumId);
      return ApiResponse.success(res, result, 'Weather alerts retrieved.');
    } catch (e) { return next(e); }
  }

  /** Get rain prediction for upcoming hours */
  async getRainPrediction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { stadiumId } = req.params;
      const result = await weatherService.getRainPrediction(stadiumId);
      return ApiResponse.success(res, result, 'Rain prediction retrieved.');
    } catch (e) { return next(e); }
  }
}

export const weatherController = new WeatherController();
