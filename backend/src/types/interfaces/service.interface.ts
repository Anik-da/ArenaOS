/**
 * ARES AI Platform — Service Interfaces
 */

import { IQueryOptions, IQueryResult } from './repository.interface';

export interface IAuthService {
  register(data: any): Promise<any>;
  login(data: any): Promise<any>;
  googleLogin(idToken: string): Promise<any>;
  refreshToken(refreshToken: string): Promise<any>;
  forgotPassword(email: string): Promise<void>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
  logout(userId: string, token: string): Promise<void>;
}

export interface ITournamentService {
  createTournament(data: any): Promise<any>;
  getTournamentById(id: string): Promise<any>;
  listTournaments(options: IQueryOptions): Promise<IQueryResult<any>>;
  updateTournament(id: string, data: any): Promise<any>;
  deleteTournament(id: string): Promise<boolean>;
  scheduleMatch(data: any): Promise<any>;
  rescheduleMatch(matchId: string, data: any): Promise<any>;
  updateLiveScore(matchId: string, teamAScore: number, teamBScore: number, status: string, details?: string): Promise<any>;
}

export interface IStadiumService {
  createStadium(data: any): Promise<any>;
  getStadiumById(id: string): Promise<any>;
  listStadiums(options: IQueryOptions): Promise<IQueryResult<any>>;
  updateStadium(id: string, data: any): Promise<any>;
  deleteStadium(id: string): Promise<boolean>;
  getGateStatus(stadiumId: string): Promise<any[]>;
  getSeatMap(stadiumId: string, zone?: string): Promise<any>;
}

export interface ICrowdService {
  reportDensity(data: any): Promise<any>;
  getCurrentDensity(stadiumId: string): Promise<any[]>;
  getZoneHistory(stadiumId: string, zoneId: string): Promise<any[]>;
  detectSurge(stadiumId: string): Promise<any[]>;
}

export interface IParkingService {
  vehicleEntry(data: any): Promise<any>;
  vehicleExit(data: any): Promise<any>;
  listSlots(stadiumId: string, options?: IQueryOptions): Promise<IQueryResult<any>>;
  getRevenue(stadiumId: string, dateFrom?: string, dateTo?: string): Promise<any>;
  getAnalytics(stadiumId: string): Promise<any>;
  getEVStations(stadiumId: string): Promise<any[]>;
}

export interface IWeatherService {
  getCurrentWeather(stadiumId: string): Promise<any>;
  getForecast(stadiumId: string, days?: number): Promise<any>;
  getAlerts(stadiumId: string): Promise<any[]>;
}

export interface ITicketService {
  bookTicket(userId: string, data: any): Promise<any>;
  validateTicket(qrCode: string): Promise<any>;
  cancelTicket(ticketId: string, userId: string): Promise<any>;
  getUserTickets(userId: string, options?: IQueryOptions): Promise<IQueryResult<any>>;
  getTicketStats(matchId: string): Promise<any>;
}

export interface IMedicalService {
  createCase(data: any): Promise<any>;
  dispatchAmbulance(data: any): Promise<any>;
  assignDoctor(data: any): Promise<any>;
  updatePatientStatus(caseId: string, status: string): Promise<any>;
  getPatientQueue(stadiumId: string): Promise<any[]>;
  getResponseMetrics(stadiumId: string): Promise<any>;
}

export interface INotificationService {
  send(data: any): Promise<any>;
  broadcast(data: any): Promise<any>;
  getUserNotifications(userId: string, options?: IQueryOptions): Promise<IQueryResult<any>>;
  markRead(notificationIds: string[]): Promise<void>;
  markAllRead(userId: string): Promise<void>;
}

export interface IAIService {
  sendMessage(userId: string, message: string, context?: string): Promise<any>;
  getConversationHistory(conversationId: string): Promise<any>;
  listConversations(userId: string): Promise<any[]>;
  naturalLanguageQuery(query: string, domain?: string): Promise<any>;
  generateReport(data: any): Promise<any>;
  analyzeVision(data: any): Promise<any>;
  predict(data: any): Promise<any>;
}
