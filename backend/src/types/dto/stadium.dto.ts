/**
 * ARES AI Platform — Stadium & Infrastructure DTOs
 */

export interface CreateStadiumDTO {
  name: string;
  city: string;
  country: string;
  capacity: number;
  gateCount: number;
  lat: number;
  lng: number;
  layoutUrl?: string;
}

export interface UpdateStadiumDTO {
  name?: string;
  city?: string;
  country?: string;
  capacity?: number;
  gateCount?: number;
  lat?: number;
  lng?: number;
  layoutUrl?: string;
  smartSensorsConnected?: number;
}

export interface CrowdDensityDTO {
  stadiumId: string;
  zoneId: string;
  currentDensity: number;
  occupancyCount: number;
}

export interface ParkingEntryDTO {
  stadiumId: string;
  slotId: string;
  vehiclePlate: string;
  type?: string;
}

export interface ParkingExitDTO {
  slotId: string;
  vehiclePlate: string;
}

export interface CreateVenueDTO {
  name: string;
  city: string;
  country: string;
  capacity: number;
  layoutUrl?: string;
}
