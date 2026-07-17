import { ParkingRepository } from '../repositories/specialized.repository';
import { ParkingSlot } from '../models';
import logger from '../utilities/logger';

export class ParkingService {
  async registerVehicleEntry(stadiumId: string, slotId: string, vehiclePlate: string) {
    logger.info(`Vehicle entry registered: ${vehiclePlate} in slot: ${slotId}`);
    
    const queryResult = await ParkingRepository.queryAdvanced({
      filters: [
        { field: 'slotId', op: '==', value: slotId },
        { field: 'stadiumId', op: '==', value: stadiumId }
      ],
      limit: 1
    });
    let targetSlot = queryResult.results[0];

    if (!targetSlot) {
      // Auto-provision slot if missing in DB
      targetSlot = await ParkingRepository.create({
        stadiumId,
        slotId,
        status: 'vacant',
        type: 'standard',
        floorLevel: 'G',
        hourlyRate: 10,
      });
    }

    if (targetSlot.status === 'occupied') {
      throw new Error(`Parking slot ${slotId} is already occupied.`);
    }

    const updatePayload: Partial<ParkingSlot> = {
      status: 'occupied',
      vehiclePlate,
      sessionStartTime: new Date(),
    };

    await ParkingRepository.update(targetSlot.id!, updatePayload);
    return { ...targetSlot, ...updatePayload };
  }

  async registerVehicleExit(stadiumId: string, slotId: string) {
    logger.info(`Vehicle exit registered from slot: ${slotId}`);
    
    const queryResult = await ParkingRepository.queryAdvanced({
      filters: [
        { field: 'slotId', op: '==', value: slotId },
        { field: 'stadiumId', op: '==', value: stadiumId }
      ],
      limit: 1
    });
    const targetSlot = queryResult.results[0];

    if (!targetSlot || targetSlot.status === 'vacant') {
      throw new Error(`Parking slot ${slotId} is not currently occupied.`);
    }

    const durationHrs = Math.max(
      1,
      Math.ceil((new Date().getTime() - new Date(targetSlot.sessionStartTime || new Date()).getTime()) / 3600000)
    );
    const cost = durationHrs * targetSlot.hourlyRate;

    const updatePayload: Partial<ParkingSlot> = {
      status: 'vacant',
      vehiclePlate: undefined,
      sessionStartTime: undefined,
    };

    await ParkingRepository.update(targetSlot.id!, updatePayload);
    return { slotId, durationHours: durationHrs, cost, status: 'vacant' };
  }

  async getParkingAnalytics(stadiumId: string) {
    const allSlots = await ParkingRepository.query('stadiumId', '==', stadiumId);
    const occupied = allSlots.filter(s => s.status === 'occupied').length;
    const vacant = allSlots.filter(s => s.status === 'vacant').length;
    const charging = allSlots.filter(s => s.status === 'ev-charging').length;

    return {
      totalSlots: allSlots.length,
      occupied,
      vacant,
      charging,
      occupancyRatePct: allSlots.length > 0 ? (occupied / allSlots.length) * 100 : 0,
    };
  }
}

export const parkingService = new ParkingService();
export default parkingService;
