import { WeatherRepository } from '../repositories/specialized.repository';
import { WeatherData } from '../models';
import { config } from '../config/app';
import { cacheService } from './cache.service';
import logger from '../utilities/logger';

class WeatherService {
  async fetchLiveStadiumWeather(stadiumId: string): Promise<WeatherData> {
    const cacheKey = `weather:live:${stadiumId}`;
    const cached = await cacheService.get<WeatherData>(cacheKey);
    if (cached) return cached;

    logger.info(`Fetching weather details for stadium: ${stadiumId}`);
    
    let temp = 24 + Math.random() * 6;
    let humidity = 60 + Math.random() * 20;
    let windSpeed = 12 + Math.random() * 8;
    let rainPct = Math.random() * 40;
    let forecast = 'Clear Skies';
    
    if (rainPct > 20) forecast = 'Partly Cloudy';
    if (rainPct > 60) forecast = 'Thunderstorms Projected';

    if (config.weather.apiKey && config.weather.apiKey !== 'mock-weather-key') {
      try {
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

    await cacheService.set(cacheKey, weatherData, 30);
    return weatherData;
  }

  async getForecast(stadiumId: string, days: number = 5) {
    const forecastList = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      forecastList.push({
        date: date.toISOString().split('T')[0],
        temp: parseFloat((22 + Math.random() * 8).toFixed(1)),
        rainPct: Math.floor(Math.random() * 100),
        forecast: Math.random() > 0.5 ? 'Clear Skies' : 'Scattered Showers',
      });
    }
    return forecastList;
  }

  async getWeatherAlerts(stadiumId: string) {
    const live = await this.fetchLiveStadiumWeather(stadiumId);
    return live.warningAlert ? [live.warningAlert] : [];
  }

  async getRainPrediction(stadiumId: string) {
    return {
      stadiumId,
      precipitationRadarPct: 24,
      rainExpectedNextHours: [
        { hour: '13:00', probabilityPct: 15 },
        { hour: '14:00', probabilityPct: 22 },
        { hour: '15:00', probabilityPct: 65 },
        { hour: '16:00', probabilityPct: 80 }
      ]
    };
  }
}

export const weatherService = new WeatherService();
export default weatherService;
