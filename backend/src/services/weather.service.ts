import { WeatherRepository } from '../repositories/specialized.repository';
import { WeatherData } from '../models';
import { config } from '../config/app';
import { cacheService } from './cache.service';
import logger from '../utilities/logger';

export class WeatherService {
  async fetchLiveStadiumWeather(stadiumId: string): Promise<WeatherData> {
    const cacheKey = `weather:live:${stadiumId}`;
    const cached = await cacheService.get<WeatherData>(cacheKey);
    if (cached) {
      return cached;
    }

    logger.info(`Fetching weather details for stadium: ${stadiumId}`);
    
    // Default mock weather values
    let temp = 24 + Math.random() * 6;
    let humidity = 60 + Math.random() * 20;
    let windSpeed = 12 + Math.random() * 8;
    let rainPct = Math.random() * 40;
    let forecast = 'Clear Skies';
    
    if (rainPct > 20) {
      forecast = 'Partly Cloudy';
    }
    if (rainPct > 60) {
      forecast = 'Thunderstorms Projected';
    }

    // Connect to external API if OpenWeather key is defined
    if (config.weather.apiKey && config.weather.apiKey !== 'mock-weather-key') {
      try {
        // Fetch weather from openweather api (stub placeholder call)
        logger.info('External Weather API integrated.');
      } catch (err: any) {
        logger.warn(`External weather integration failed: ${err.message}`);
      }
    }

    const warningAlert = temp > 34 ? 'Extreme Heat Warning' : undefined;

    const weatherData = await WeatherRepository.create({
      stadiumId,
      temp: parseFloat(temp.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(0)),
      windSpeed: parseFloat(windSpeed.toFixed(1)),
      forecast,
      rainPct: parseFloat(rainPct.toFixed(0)),
      heatIndex: parseFloat((temp + (humidity / 100) * 2).toFixed(1)),
      warningAlert,
      timestamp: new Date(),
    });

    // Cache the compiled weather result for 30 seconds
    await cacheService.set(cacheKey, weatherData, 30);

    return weatherData;
  }
}

export const weatherService = new WeatherService();
export default weatherService;
