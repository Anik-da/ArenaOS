/**
 * ARES AI Platform — Tournament & Match DTOs
 */

export interface CreateTournamentDTO {
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdateTournamentDTO {
  name?: string;
  sport?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  description?: string;
  logoUrl?: string;
}

export interface ScheduleMatchDTO {
  tournamentId: string;
  teamAId: string;
  teamBId: string;
  venueId: string;
  dateTime: string;
  refereeId?: string;
}

export interface RescheduleMatchDTO {
  dateTime: string;
  venueId?: string;
  reason: string;
}

export interface UpdateScoreDTO {
  teamAScore: number;
  teamBScore: number;
  status: string;
  details?: string;
}

export interface CreateTeamDTO {
  name: string;
  code: string;
  country: string;
  logoUrl?: string;
  tournamentId?: string;
}

export interface UpdateTeamDTO {
  name?: string;
  code?: string;
  country?: string;
  logoUrl?: string;
}

export interface CreatePlayerDTO {
  teamId: string;
  name: string;
  jerseyNumber: number;
  position: string;
  nationality?: string;
  dateOfBirth?: string;
  stats?: Record<string, any>;
}

export interface UpdatePlayerDTO {
  name?: string;
  jerseyNumber?: number;
  position?: string;
  stats?: Record<string, any>;
}

export interface CreateOfficialDTO {
  name: string;
  role: string;
  licenseNumber: string;
  nationality?: string;
}

export interface AssignOfficialDTO {
  matchId: string;
  officialId: string;
  role: string;
}

export interface SchedulePracticeDTO {
  teamId: string;
  venueId: string;
  dateTime: string;
  durationMinutes: number;
  notes?: string;
}
