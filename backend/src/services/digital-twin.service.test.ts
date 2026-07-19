import { vi, describe, it, expect, beforeEach } from 'vitest';
import { digitalTwinService } from './digital-twin.service';
import {
  DigitalTwinRepository, GateRepository, SeatRepository, CameraRepository,
  DroneRepository, EmergencyVehicleRepository, CrowdZoneRepository
} from '../repositories/specialized.repository';

vi.mock('../repositories/specialized.repository', () => {
  const mockRepo = () => ({
    query: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue(true),
  });
  return {
    DigitalTwinRepository: mockRepo(),
    GateRepository: mockRepo(),
    SeatRepository: mockRepo(),
    CameraRepository: mockRepo(),
    DroneRepository: mockRepo(),
    EmergencyVehicleRepository: mockRepo(),
    CrowdZoneRepository: mockRepo(),
  };
});

describe('DigitalTwinService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getState', () => {
    it('returns a combined twin state for a given stadium ID', async () => {
      const stadiumId = 'stadium-123';
      
      // Mock repository returns
      vi.mocked(DigitalTwinRepository.query).mockResolvedValue([{ id: 'twin-1', layersActive: ['seats', 'parking'] }]);
      vi.mocked(GateRepository.query).mockResolvedValue([{ id: 'gate-1', status: 'open' }]);
      vi.mocked(DroneRepository.query).mockResolvedValue([{ id: 'drone-1', battery: 80 }]);
      vi.mocked(CameraRepository.query).mockResolvedValue([{ id: 'cam-1', status: 'active' }]);
      vi.mocked(EmergencyVehicleRepository.query).mockResolvedValue([{ id: 'veh-1', status: 'dispatched' }]);
      vi.mocked(CrowdZoneRepository.query).mockResolvedValue([{ id: 'zone-1', density: 45 }]);

      const state = await digitalTwinService.getState(stadiumId);

      expect(state.stadiumId).toBe(stadiumId);
      expect(state.layersActive).toEqual(['seats', 'parking']);
      expect(state.gatesCount).toBe(1);
      expect(state.dronesCount).toBe(1);
      expect(state.camerasCount).toBe(1);
      expect(state.emergencyVehiclesCount).toBe(1);
      expect(state.activeAlerts).toBe(1);
      expect(state.data.gates[0].id).toBe('gate-1');
      expect(state.data.drones[0].id).toBe('drone-1');
    });

    it('uses default layers if no digital twin configuration exists in db', async () => {
      const stadiumId = 'stadium-empty';
      vi.mocked(DigitalTwinRepository.query).mockResolvedValue([]);

      const state = await digitalTwinService.getState(stadiumId);
      expect(state.layersActive).toEqual(['infrastructure', 'gates']);
    });
  });

  describe('updateLayers', () => {
    it('updates layers if twin state already exists', async () => {
      const stadiumId = 'stadium-123';
      vi.mocked(DigitalTwinRepository.query).mockResolvedValue([{ id: 'twin-1', layersActive: ['seats'] }]);

      const result = await digitalTwinService.updateLayers(stadiumId, ['seats', 'cameras']);
      
      expect(DigitalTwinRepository.update).toHaveBeenCalledWith('twin-1', expect.objectContaining({
        layersActive: ['seats', 'cameras']
      }));
      expect(result).toEqual({ stadiumId, layersActive: ['seats', 'cameras'] });
    });

    it('creates new twin state if one does not exist', async () => {
      const stadiumId = 'stadium-new';
      vi.mocked(DigitalTwinRepository.query).mockResolvedValue([]);

      await digitalTwinService.updateLayers(stadiumId, ['drones']);

      expect(DigitalTwinRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        stadiumId,
        layersActive: ['drones']
      }));
    });
  });

  describe('getSeatMap', () => {
    it('returns seats for a stadium ID and filters by zone if provided', async () => {
      const seats = [
        { id: 's1', zone: 'A' },
        { id: 's2', zone: 'B' }
      ];
      vi.mocked(SeatRepository.query).mockResolvedValue(seats);

      const allSeats = await digitalTwinService.getSeatMap('stadium-1');
      expect(allSeats).toHaveLength(2);

      const zoneASeats = await digitalTwinService.getSeatMap('stadium-1', 'A');
      expect(zoneASeats).toHaveLength(1);
      expect(zoneASeats[0].id).toBe('s1');
    });
  });
});
