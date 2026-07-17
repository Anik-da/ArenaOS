import { EnergyRepository, WaterRepository, SecurityRepository } from '../repositories/specialized.repository';
import logger from '../utilities/logger';

class UtilityService {
  async trackLiveEnergy(stadiumId: string) {
    const solarPowerKW = 450 + Math.random() * 150;
    const gridPowerKW = 1200 + Math.random() * 300;
    const generatorPowerKW = Math.random() > 0.85 ? 500 : 0;
    const totalConsumptionKW = solarPowerKW + gridPowerKW + generatorPowerKW;
    const batteryBackupPct = Math.max(20, Math.min(100, 85 - (Math.random() * 5)));

    return EnergyRepository.create({
      stadiumId,
      gridPowerKW: parseFloat(gridPowerKW.toFixed(1)),
      solarPowerKW: parseFloat(solarPowerKW.toFixed(1)),
      generatorPowerKW: parseFloat(generatorPowerKW.toFixed(1)),
      batteryBackupPct: parseFloat(batteryBackupPct.toFixed(1)),
      totalConsumptionKW: parseFloat(totalConsumptionKW.toFixed(1)),
      timestamp: new Date(),
    });
  }

  async trackLiveWater(stadiumId: string) {
    const consumptionLiters = 18000 + Math.random() * 4000;
    const storageLiters = 150000 - consumptionLiters;
    const leakDetected = Math.random() > 0.95;
    const leakSector = leakDetected ? `Sector ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}` : undefined;

    if (leakDetected) {
      logger.warn(`Water Leak Detected in sector ${leakSector} at stadium ${stadiumId}`);
    }

    return WaterRepository.create({
      stadiumId,
      consumptionLiters: parseFloat(consumptionLiters.toFixed(1)),
      storageLiters: parseFloat(storageLiters.toFixed(1)),
      leakDetected,
      leakSector,
      timestamp: new Date(),
    });
  }

  async getEnergyAnalytics(stadiumId: string, limit: number = 30) {
    const query = await EnergyRepository.queryAdvanced({
      filters: [{ field: 'stadiumId', op: '==', value: stadiumId }],
      orderBy: [{ field: 'timestamp', direction: 'desc' }],
      limit,
    });
    return query.results;
  }

  async getWaterAnalytics(stadiumId: string, limit: number = 30) {
    const query = await WaterRepository.queryAdvanced({
      filters: [{ field: 'stadiumId', op: '==', value: stadiumId }],
      orderBy: [{ field: 'timestamp', direction: 'desc' }],
      limit,
    });
    return query.results;
  }

  async reportLeak(stadiumId: string, sector: string, severity: string) {
    logger.error(`🚨 INFRASTRUCTURE ALERT: Water leak reported in ${sector} (Severity: ${severity})`);
    
    // Auto-create security/incident ticket for maintenance dispatch
    await SecurityRepository.create({
      stadiumId,
      type: 'general_alert',
      zoneId: sector,
      severity: severity as any,
      description: `AUTOMATED REPORT: Infrastructure leak detected in ${sector}. Immediate maintenance check needed.`,
      status: 'open',
      timestamp: new Date(),
    });

    return { success: true, sector, severity };
  }
}

export const utilityService = new UtilityService();
export default utilityService;
