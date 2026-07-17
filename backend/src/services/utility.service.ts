import { EnergyRepository, WaterRepository } from '../repositories/specialized.repository';
import logger from '../utilities/logger';

export class UtilityService {
  async trackLiveEnergy(stadiumId: string) {
    // Generate simulated dynamic fluctuations for energy
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
    const leakDetected = Math.random() > 0.95; // 5% probability simulation
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
}

export const utilityService = new UtilityService();
export default utilityService;
