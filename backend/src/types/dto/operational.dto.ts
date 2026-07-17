/**
 * ARES AI Platform — Operational DTOs (Weather, Energy, Water, Drone, DigitalTwin)
 */

export interface WeatherQueryDTO {
  stadiumId: string;
  date?: string;
}

export interface EnergyReadingDTO {
  stadiumId: string;
  gridPowerKW: number;
  solarPowerKW: number;
  generatorPowerKW: number;
  batteryBackupPct: number;
}

export interface WaterReadingDTO {
  stadiumId: string;
  consumptionLiters: number;
  storageLiters: number;
  leakDetected: boolean;
  leakSector?: string;
}

export interface DroneStatusDTO {
  droneId: string;
  stadiumId: string;
  status: string;
  batteryPct: number;
  coordinates: { x: number; y: number; z: number };
  streamUrl?: string;
}

export interface DigitalTwinLayerDTO {
  stadiumId: string;
  layersActive: string[];
}

export interface UpdateGateStatusDTO {
  gateId: string;
  status: string;
}

export interface UpdateSeatMapDTO {
  stadiumId: string;
  zone: string;
  updates: { seatId: string; status: string }[];
}

export interface ReportLeakDTO {
  stadiumId: string;
  sector: string;
  severity: string;
  description?: string;
}
