/**
 * ARES AI Platform — Shared Enumerations
 * Central enum definitions used across all domain modules.
 */

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  TOURNAMENT_ORGANIZER = 'Tournament Organizer',
  SECURITY_OFFICER = 'Security Officer',
  MEDICAL_STAFF = 'Medical Staff',
  VOLUNTEER = 'Volunteer',
  PARKING_STAFF = 'Parking Staff',
  FAN = 'Fan',
  GUEST = 'Guest',
}

export enum TournamentStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

export enum TicketStatus {
  BOOKED = 'booked',
  VALIDATED = 'validated',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum ParkingSlotType {
  STANDARD = 'standard',
  VIP = 'vip',
  EV = 'ev',
}

export enum ParkingSlotStatus {
  VACANT = 'vacant',
  OCCUPIED = 'occupied',
  EV_CHARGING = 'ev-charging',
}

export enum SecurityEventType {
  RESTRICTED_AREA_BREACH = 'restricted_area_breach',
  ABANDONED_OBJECT = 'abandoned_object',
  FIRE_ALERT = 'fire_alert',
  CROWD_SURGE = 'crowd_surge',
  GENERAL_ALERT = 'general_alert',
}

export enum SecurityEventStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  CRITICAL = 'critical',
}

export enum MedicalEventType {
  CARDIAC_ARREST = 'cardiac_arrest',
  HEAT_EXHAUSTION = 'heat_exhaustion',
  INJURY = 'injury',
  OTHER = 'other',
}

export enum MedicalEventStatus {
  DISPATCHED = 'dispatched',
  TRIAGE = 'triage',
  TRANSPORTED = 'transported',
  RESOLVED = 'resolved',
}

export enum EmergencyAlertSeverity {
  INFO = 'info',
  WARN = 'warn',
  CRITICAL = 'critical',
}

export enum BroadcastScope {
  ALL = 'all',
  STAFF = 'staff',
  SECURITY = 'security',
}

export enum NotificationType {
  EMERGENCY = 'emergency',
  SECURITY = 'security',
  PARKING = 'parking',
  MEDICAL = 'medical',
  GENERAL = 'general',
}

export enum OfficialRole {
  REFEREE = 'referee',
  LINESMAN = 'linesman',
  VAR_REFEREE = 'var_referee',
  MATCH_COMMISSIONER = 'match_commissioner',
}

export enum DroneStatus {
  PATROLLING = 'patrolling',
  CHARGING = 'charging',
  TRACKING = 'tracking',
}

export enum ReportType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
}

export enum AnalyticsType {
  ATTENDANCE = 'attendance',
  REVENUE = 'revenue',
  PARKING = 'parking',
  CROWD = 'crowd',
  ENERGY = 'energy',
  WATER = 'water',
  SECURITY = 'security',
  MEDICAL = 'medical',
  WEATHER = 'weather',
  PERFORMANCE = 'performance',
}

export enum GateStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  RESTRICTED = 'restricted',
  EMERGENCY_ONLY = 'emergency_only',
}

export enum SeatStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  OCCUPIED = 'occupied',
  BLOCKED = 'blocked',
}
