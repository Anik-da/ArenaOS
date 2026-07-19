import {
  DigitalTwinRepository, GateRepository, SeatRepository, CameraRepository,
  DroneRepository, EmergencyVehicleRepository, CrowdZoneRepository
} from '../repositories/specialized.repository';
import logger from '../utilities/logger';

class DigitalTwinService {
  async getState(stadiumId: string) {
    const [twinState, gates, drones, cameras, emergencyVehicles, crowdZones] = await Promise.all([
      DigitalTwinRepository.query('stadiumId', '==', stadiumId),
      this.getGateStatus(stadiumId),
      this.getDronePositions(stadiumId),
      this.getCameraPositions(stadiumId),
      this.getEmergencyVehicles(stadiumId),
      this.getCrowdZones(stadiumId)
    ]);

    const layers = twinState.length > 0 ? twinState[0].layersActive : ['infrastructure', 'gates'];

    return {
      stadiumId,
      layersActive: layers,
      gatesCount: gates.length,
      dronesCount: drones.length,
      camerasCount: cameras.length,
      emergencyVehiclesCount: emergencyVehicles.length,
      activeAlerts: emergencyVehicles.filter((v: any) => v.status === 'dispatched').length,
      data: {
        gates,
        drones,
        cameras,
        emergencyVehicles,
        crowdZones
      },
      lastUpdated: new Date()
    };
  }

  async updateLayers(stadiumId: string, layersActive: string[]) {
    const twinState = await DigitalTwinRepository.query('stadiumId', '==', stadiumId);
    if (twinState.length > 0) {
      await DigitalTwinRepository.update(twinState[0].id!, { layersActive, lastUpdated: new Date() });
    } else {
      await DigitalTwinRepository.create({ stadiumId, layersActive, systemLoadPct: 15, lastUpdated: new Date() });
    }
    return { stadiumId, layersActive };
  }

  async getSeatMap(stadiumId: string, zone?: string) {
    const seats = await SeatRepository.query('stadiumId', '==', stadiumId);
    if (zone) {
      return seats.filter((s: any) => s.zone === zone);
    }
    return seats;
  }

  async updateSeatMap(stadiumId: string, zone: string, updates: { seatId: string; status: any }[]) {
    for (const update of updates) {
      await SeatRepository.update(update.seatId, { status: update.status });
    }
    return { success: true, updatedCount: updates.length };
  }

  async getGateStatus(stadiumId: string) {
    return await GateRepository.query('stadiumId', '==', stadiumId);
  }

  async updateGateStatus(stadiumId: string, gateId: string, status: any) {
    await GateRepository.update(gateId, { status });
    logger.info(`Gate ${gateId} status updated to: ${status}`);
    return { gateId, status };
  }

  async getDronePositions(stadiumId: string) {
    return await DroneRepository.query('stadiumId', '==', stadiumId);
  }

  async getCameraPositions(stadiumId: string) {
    return await CameraRepository.query('stadiumId', '==', stadiumId);
  }

  async getEmergencyVehicles(stadiumId: string) {
    return await EmergencyVehicleRepository.query('stadiumId', '==', stadiumId);
  }

  async getCrowdZones(stadiumId: string) {
    return await CrowdZoneRepository.query('stadiumId', '==', stadiumId);
  }
}

export const digitalTwinService = new DigitalTwinService();
