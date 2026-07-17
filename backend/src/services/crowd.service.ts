import { CrowdRepository, CrowdZoneRepository } from '../repositories/specialized.repository';
import { cacheService } from './cache.service';
import logger from '../utilities/logger';

class CrowdService {
  /** Report and store a crowd density reading */
  async reportDensity(data: any) {
    const record = await CrowdRepository.create({
      ...data,
      surgeAlertTriggered: data.currentDensity >= 85,
      timestamp: new Date(),
    });

    // Update the CrowdZone aggregate
    const zones = await CrowdZoneRepository.query('stadiumId', '==', data.stadiumId);
    const zone = zones.find((z: any) => z.zoneName === data.zoneId || z.id === data.zoneId);
    if (zone) {
      const status = data.currentDensity >= 90 ? 'critical' : data.currentDensity >= 70 ? 'crowded' : 'normal';
      await CrowdZoneRepository.update(zone.id!, {
        currentOccupancy: data.occupancyCount,
        densityPercentage: data.currentDensity,
        status,
      });
    }

    // Invalidate cache
    await cacheService.del(`crowd:density:${data.stadiumId}`);

    if (data.currentDensity >= 85) {
      logger.warn(`SURGE ALERT: Zone ${data.zoneId} in stadium ${data.stadiumId} at ${data.currentDensity}%`);
    }

    return record;
  }

  /** Get current density for all zones in a stadium */
  async getCurrentDensity(stadiumId: string) {
    const cacheKey = `crowd:density:${stadiumId}`;
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) return cached;

    const zones = await CrowdZoneRepository.query('stadiumId', '==', stadiumId);
    await cacheService.set(cacheKey, zones, 30); // 30-second cache for real-time data
    return zones;
  }

  /** Get density history for a specific zone */
  async getZoneHistory(stadiumId: string, zoneId: string, limit: number = 50) {
    const result = await CrowdRepository.queryAdvanced({
      filters: [
        { field: 'stadiumId', op: '==', value: stadiumId },
        { field: 'zoneId', op: '==', value: zoneId },
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }],
      limit,
    });
    return result.results;
  }

  /** Detect active surge conditions */
  async detectSurge(stadiumId: string) {
    const result = await CrowdRepository.queryAdvanced({
      filters: [
        { field: 'stadiumId', op: '==', value: stadiumId },
        { field: 'surgeAlertTriggered', op: '==', value: true },
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }],
      limit: 20,
    });
    return result.results;
  }
}

export const crowdService = new CrowdService();
