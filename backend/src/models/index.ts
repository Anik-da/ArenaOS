export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Tournament Organizer' | 'Security Officer' | 'Medical Staff' | 'Volunteer' | 'Parking Staff' | 'Fan' | 'Guest';
  permissions: string[];
  photoUrl?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
}

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  logoUrl?: string;
  organizerId: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  tournamentId: string;
  teamAId: string;
  teamBId: string;
  venueId: string;
  dateTime: Date;
  status: 'scheduled' | 'live' | 'completed' | 'delayed' | 'cancelled';
  score: {
    teamAScore: number;
    teamBScore: number;
    details?: string;
  };
  refereeId?: string;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  country: string;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  jerseyNumber: number;
  position: string;
  stats: Record<string, any>;
}

export interface Official {
  id: string;
  name: string;
  role: 'referee' | 'linesman' | 'var_referee' | 'match_commissioner';
  licenseNumber: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  layoutUrl?: string;
}

export interface Stadium extends Venue {
  stadiumId: string;
  gateCount: number;
  smartSensorsConnected: number;
  locationGeo: { lat: number; lng: number };
}

export interface Ticket {
  id: string;
  matchId: string;
  userId: string;
  qrCode: string;
  seatNumber: string;
  zone: string;
  gate: string;
  price: number;
  currency: string;
  status: 'booked' | 'validated' | 'cancelled' | 'refunded';
  validatedAt?: Date;
  createdAt: Date;
}

export interface CrowdDensity {
  id: string;
  stadiumId: string;
  zoneId: string;
  currentDensity: number; // percentage (0 to 100)
  surgeAlertTriggered: boolean;
  occupancyCount: number;
  timestamp: Date;
}

export interface ParkingSlot {
  id: string;
  stadiumId: string;
  slotId: string;
  status: 'vacant' | 'occupied' | 'ev-charging';
  type: 'standard' | 'vip' | 'ev';
  floorLevel: string;
  vehiclePlate?: string;
  sessionStartTime?: Date;
  hourlyRate: number;
}

export interface WeatherData {
  id: string;
  stadiumId: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  forecast: string;
  rainPct: number;
  heatIndex: number;
  warningAlert?: string;
  timestamp: Date;
}

export interface SecurityEvent {
  id: string;
  stadiumId: string;
  type: 'restricted_area_breach' | 'abandoned_object' | 'fire_alert' | 'crowd_surge' | 'general_alert';
  zoneId: string;
  status: 'open' | 'investigating' | 'resolved';
  severity: 'low' | 'medium' | 'critical';
  description: string;
  assignedResponderId?: string;
  timestamp: Date;
}

export interface MedicalEvent {
  id: string;
  stadiumId: string;
  patientName?: string;
  type: 'cardiac_arrest' | 'heat_exhaustion' | 'injury' | 'other';
  status: 'dispatched' | 'triage' | 'transported' | 'resolved';
  ambulanceId?: string;
  assignedDoctor?: string;
  responseStartTime?: Date;
  responseEndTime?: Date;
  timestamp: Date;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warn' | 'critical';
  broadcastScope: 'all' | 'staff' | 'security';
  active: boolean;
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  type: 'emergency' | 'security' | 'parking' | 'general';
  timestamp: Date;
}

export interface EnergyUsage {
  id: string;
  stadiumId: string;
  gridPowerKW: number;
  solarPowerKW: number;
  generatorPowerKW: number;
  batteryBackupPct: number;
  totalConsumptionKW: number;
  timestamp: Date;
}

export interface WaterUsage {
  id: string;
  stadiumId: string;
  consumptionLiters: number;
  storageLiters: number;
  leakDetected: boolean;
  leakSector?: string;
  timestamp: Date;
}

export interface DroneFeed {
  id: string;
  droneId: string;
  stadiumId: string;
  streamUrl: string;
  batteryPct: number;
  coordinates: { x: number; y: number; z: number };
  status: 'patrolling' | 'charging' | 'tracking';
}

export interface DigitalTwinState {
  id: string;
  stadiumId: string;
  layersActive: string[];
  systemLoadPct: number;
  lastUpdated: Date;
}

export interface AnalyticsRecord {
  id: string;
  stadiumId: string;
  type: 'attendance' | 'revenue' | 'utility' | 'security' | 'medical';
  metrics: Record<string, any>;
  timestamp: Date;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
  fileUrl: string;
  generatedBy: string;
  timestamp: Date;
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: {
    sender: 'user' | 'assistant';
    text: string;
    timestamp: Date;
  }[];
  createdAt: Date;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  description?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
  timestamp: Date;
}

export interface FanProfile {
  id: string;
  userId: string;
  favorites: string[];
  preferredZone?: string;
  loyaltyPoints: number;
  emergencyContact?: string;
  createdAt: Date;
}

export interface AccessLog {
  id: string;
  stadiumId: string;
  userId?: string;
  gateId: string;
  direction: 'entry' | 'exit';
  method: 'qr' | 'badge' | 'manual';
  timestamp: Date;
}

export interface VisitorLog {
  id: string;
  stadiumId: string;
  visitorName: string;
  purpose: string;
  hostName?: string;
  badgeNumber?: string;
  checkIn: Date;
  checkOut?: Date;
}

export interface Hospital {
  id: string;
  name: string;
  distance: number;
  capacity: number;
  specialties: string[];
  contactNumber: string;
  coordinates: { lat: number; lng: number };
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  stadiumId?: string;
  available: boolean;
  contactNumber: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  stadiumId: string;
  status: 'available' | 'dispatched' | 'returning' | 'maintenance';
  currentLocation?: { lat: number; lng: number };
  equipment: string[];
}

export interface PatientQueue {
  id: string;
  stadiumId: string;
  medicalEventId: string;
  priority: 'critical' | 'urgent' | 'normal';
  estimatedWaitMinutes: number;
  position: number;
  timestamp: Date;
}

export interface PracticeSession {
  id: string;
  teamId: string;
  venueId: string;
  tournamentId?: string;
  dateTime: Date;
  durationMinutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Gate {
  id: string;
  stadiumId: string;
  gateNumber: string;
  zone: string;
  status: 'open' | 'closed' | 'restricted' | 'emergency_only';
  throughputPerMinute: number;
  currentQueueLength: number;
}

export interface Seat {
  id: string;
  stadiumId: string;
  zone: string;
  row: string;
  number: string;
  status: 'available' | 'booked' | 'occupied' | 'blocked';
  category: 'standard' | 'vip' | 'premium' | 'accessible';
}

export interface CameraPosition {
  id: string;
  stadiumId: string;
  cameraId: string;
  zone: string;
  coordinates: { x: number; y: number; z: number };
  streamUrl: string;
  status: 'active' | 'offline' | 'maintenance';
}

export interface EmergencyVehicle {
  id: string;
  stadiumId: string;
  type: 'ambulance' | 'fire_truck' | 'police';
  vehicleNumber: string;
  status: 'standby' | 'dispatched' | 'returning';
  currentLocation?: { lat: number; lng: number };
}

export interface CrowdZone {
  id: string;
  stadiumId: string;
  zoneName: string;
  maxCapacity: number;
  currentOccupancy: number;
  densityPercentage: number;
  status: 'normal' | 'crowded' | 'critical';
  gates: string[];
}
