import { BaseRepository } from './base.repository';
import {
  User, Match, Ticket, Tournament, Stadium, ParkingSlot,
  CrowdDensity, WeatherData, SecurityEvent, MedicalEvent,
  EnergyUsage, WaterUsage, DroneFeed, AuditLog, AIConversation,
  Setting, Notification
} from '../models';

export const UserRepository = new BaseRepository<User>('Users');
export const MatchRepository = new BaseRepository<Match>('Matches');
export const TicketRepository = new BaseRepository<Ticket>('Tickets');
export const TournamentRepository = new BaseRepository<Tournament>('Tournaments');
export const StadiumRepository = new BaseRepository<Stadium>('Stadiums');
export const ParkingRepository = new BaseRepository<ParkingSlot>('Parking');
export const CrowdRepository = new BaseRepository<CrowdDensity>('Crowd');
export const WeatherRepository = new BaseRepository<WeatherData>('Weather');
export const SecurityRepository = new BaseRepository<SecurityEvent>('SecurityEvents');
export const MedicalRepository = new BaseRepository<MedicalEvent>('MedicalEvents');
export const EnergyRepository = new BaseRepository<EnergyUsage>('EnergyUsage');
export const WaterRepository = new BaseRepository<WaterUsage>('WaterUsage');
export const DroneRepository = new BaseRepository<DroneFeed>('DroneFeeds');
export const AuditRepository = new BaseRepository<AuditLog>('AuditLogs');
export const AIConversationRepository = new BaseRepository<AIConversation>('AIConversations');
export const SettingRepository = new BaseRepository<Setting>('Settings');
export const NotificationRepository = new BaseRepository<Notification>('Notifications');
