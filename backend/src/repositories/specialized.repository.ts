import { BaseRepository } from './base.repository';
import {
  User, Match, Ticket, Tournament, Stadium, ParkingSlot,
  CrowdDensity, WeatherData, SecurityEvent, MedicalEvent,
  EnergyUsage, WaterUsage, DroneFeed, AuditLog, AIConversation,
  Setting, Notification, Team, Player, Official, Venue,
  EmergencyAlert, AnalyticsRecord, Report, DigitalTwinState,
  FanProfile, AccessLog, VisitorLog, Hospital, Doctor, Ambulance,
  PatientQueue, PracticeSession, Gate, Seat, CameraPosition,
  EmergencyVehicle, CrowdZone, Role, Permission
} from '../models';

// ================================================
// CORE REPOSITORIES
// ================================================
export const UserRepository = new BaseRepository<User>('Users');
export const RoleRepository = new BaseRepository<Role>('Roles');
export const PermissionRepository = new BaseRepository<Permission>('Permissions');

// ================================================
// TOURNAMENT & MATCH REPOSITORIES
// ================================================
export const TournamentRepository = new BaseRepository<Tournament>('Tournaments');
export const MatchRepository = new BaseRepository<Match>('Matches');
export const TeamRepository = new BaseRepository<Team>('Teams');
export const PlayerRepository = new BaseRepository<Player>('Players');
export const OfficialRepository = new BaseRepository<Official>('Officials');
export const VenueRepository = new BaseRepository<Venue>('Venues');
export const PracticeSessionRepository = new BaseRepository<PracticeSession>('PracticeSessions');

// ================================================
// STADIUM & INFRASTRUCTURE REPOSITORIES
// ================================================
export const StadiumRepository = new BaseRepository<Stadium>('Stadiums');
export const GateRepository = new BaseRepository<Gate>('Gates');
export const SeatRepository = new BaseRepository<Seat>('Seats');
export const CameraRepository = new BaseRepository<CameraPosition>('CameraPositions');

// ================================================
// TICKETING & FAN REPOSITORIES
// ================================================
export const TicketRepository = new BaseRepository<Ticket>('Tickets');
export const FanProfileRepository = new BaseRepository<FanProfile>('FanProfiles');

// ================================================
// PARKING REPOSITORIES
// ================================================
export const ParkingRepository = new BaseRepository<ParkingSlot>('Parking');

// ================================================
// CROWD & DIGITAL TWIN REPOSITORIES
// ================================================
export const CrowdRepository = new BaseRepository<CrowdDensity>('Crowd');
export const CrowdZoneRepository = new BaseRepository<CrowdZone>('CrowdZones');
export const DigitalTwinRepository = new BaseRepository<DigitalTwinState>('DigitalTwin');

// ================================================
// WEATHER REPOSITORY
// ================================================
export const WeatherRepository = new BaseRepository<WeatherData>('Weather');

// ================================================
// SECURITY & INCIDENT REPOSITORIES
// ================================================
export const SecurityRepository = new BaseRepository<SecurityEvent>('SecurityEvents');
export const AccessLogRepository = new BaseRepository<AccessLog>('AccessLogs');
export const VisitorLogRepository = new BaseRepository<VisitorLog>('VisitorLogs');

// ================================================
// MEDICAL & EMERGENCY REPOSITORIES
// ================================================
export const MedicalRepository = new BaseRepository<MedicalEvent>('MedicalEvents');
export const EmergencyAlertRepository = new BaseRepository<EmergencyAlert>('EmergencyAlerts');
export const HospitalRepository = new BaseRepository<Hospital>('Hospitals');
export const DoctorRepository = new BaseRepository<Doctor>('Doctors');
export const AmbulanceRepository = new BaseRepository<Ambulance>('Ambulances');
export const PatientQueueRepository = new BaseRepository<PatientQueue>('PatientQueue');
export const EmergencyVehicleRepository = new BaseRepository<EmergencyVehicle>('EmergencyVehicles');

// ================================================
// UTILITY REPOSITORIES (ENERGY, WATER, DRONE)
// ================================================
export const EnergyRepository = new BaseRepository<EnergyUsage>('EnergyUsage');
export const WaterRepository = new BaseRepository<WaterUsage>('WaterUsage');
export const DroneRepository = new BaseRepository<DroneFeed>('DroneFeeds');

// ================================================
// ANALYTICS & REPORTS REPOSITORIES
// ================================================
export const AnalyticsRepository = new BaseRepository<AnalyticsRecord>('Analytics');
export const ReportRepository = new BaseRepository<Report>('Reports');

// ================================================
// AI REPOSITORY
// ================================================
export const AIConversationRepository = new BaseRepository<AIConversation>('AIConversations');

// ================================================
// NOTIFICATION & SETTINGS REPOSITORIES
// ================================================
export const NotificationRepository = new BaseRepository<Notification>('Notifications');
export const SettingRepository = new BaseRepository<Setting>('Settings');

// ================================================
// AUDIT & LOGGING REPOSITORIES
// ================================================
export const AuditRepository = new BaseRepository<AuditLog>('AuditLogs');
