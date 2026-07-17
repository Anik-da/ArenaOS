import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import {
  TournamentRepository, MatchRepository, TeamRepository, PlayerRepository,
  OfficialRepository, PracticeSessionRepository
} from '../repositories/specialized.repository';
import { tournamentService } from '../services/tournament.service';
import ApiResponse from '../utilities/apiResponse';

export class TournamentController {
  async createTournament(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await tournamentService.createTournament({
        ...req.body,
        organizerId: req.user!.id,
      });
      return ApiResponse.success(res, result, 'Tournament created successfully.', 201);
    } catch (e) { return next(e); }
  }

  async listTournaments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const filters: any[] = [];
      if (status) filters.push({ field: 'status', op: '==', value: status });

      const result = await TournamentRepository.queryAdvanced({ filters, limit });
      return ApiResponse.success(res, result.results, 'Tournaments retrieved successfully.', 200, {
        total: result.total,
        hasNext: result.hasNext,
      });
    } catch (e) { return next(e); }
  }

  async getTournamentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { tournamentId } = req.params;
      const result = await TournamentRepository.getById(tournamentId);
      if (!result) return ApiResponse.error(res, 'Tournament not found.', 404);
      return ApiResponse.success(res, result, 'Tournament retrieved successfully.');
    } catch (e) { return next(e); }
  }

  async updateTournament(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { tournamentId } = req.params;
      const success = await TournamentRepository.update(tournamentId, req.body);
      if (!success) return ApiResponse.error(res, 'Tournament not found.', 404);
      return ApiResponse.success(res, { id: tournamentId, ...req.body }, 'Tournament updated successfully.');
    } catch (e) { return next(e); }
  }

  async deleteTournament(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { tournamentId } = req.params;
      const success = await TournamentRepository.delete(tournamentId);
      if (!success) return ApiResponse.error(res, 'Tournament not found.', 404);
      return ApiResponse.success(res, { id: tournamentId }, 'Tournament deleted successfully.');
    } catch (e) { return next(e); }
  }

  // TEAM MANAGEMENT
  async createTeam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await TeamRepository.create(req.body);
      return ApiResponse.success(res, result, 'Team registered successfully.', 201);
    } catch (e) { return next(e); }
  }

  async listTeams(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tournamentId = req.query.tournamentId as string;
      const filters: any[] = [];
      if (tournamentId) filters.push({ field: 'tournamentId', op: '==', value: tournamentId });
      const result = await TeamRepository.queryAdvanced({ filters, limit: 100 });
      return ApiResponse.success(res, result.results, 'Teams retrieved successfully.');
    } catch (e) { return next(e); }
  }

  // PLAYER MANAGEMENT
  async createPlayer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PlayerRepository.create(req.body);
      return ApiResponse.success(res, result, 'Player registered successfully.', 201);
    } catch (e) { return next(e); }
  }

  async listPlayers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const teamId = req.query.teamId as string;
      if (!teamId) return ApiResponse.error(res, 'teamId parameter is required.', 400);
      const result = await PlayerRepository.query('teamId', '==', teamId);
      return ApiResponse.success(res, result, 'Players retrieved successfully.');
    } catch (e) { return next(e); }
  }

  // OFFICIAL MANAGEMENT
  async createOfficial(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await OfficialRepository.create(req.body);
      return ApiResponse.success(res, result, 'Official registered successfully.', 201);
    } catch (e) { return next(e); }
  }

  async assignOfficial(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { matchId, officialId } = req.body;
      await MatchRepository.update(matchId, { refereeId: officialId });
      return ApiResponse.success(res, { matchId, officialId }, 'Official assigned successfully.');
    } catch (e) { return next(e); }
  }

  // PRACTICE SESSION
  async schedulePractice(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PracticeSessionRepository.create({
        ...req.body,
        status: 'scheduled',
      });
      return ApiResponse.success(res, result, 'Practice session scheduled successfully.', 201);
    } catch (e) { return next(e); }
  }
}

export class MatchController {
  async scheduleMatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await tournamentService.scheduleMatch(req.body);
      return ApiResponse.success(res, result, 'Match scheduled successfully.', 201);
    } catch (e) { return next(e); }
  }

  async rescheduleMatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.params;
      const { dateTime, venueId } = req.body;
      const updates: any = { dateTime: new Date(dateTime) };
      if (venueId) updates.venueId = venueId;
      updates.status = 'delayed';

      await MatchRepository.update(matchId, updates);
      return ApiResponse.success(res, { matchId, ...updates }, 'Match rescheduled successfully.');
    } catch (e) { return next(e); }
  }

  async listMatches(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tournamentId = req.query.tournamentId as string;
      const status = req.query.status as string;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const filters: any[] = [];
      if (tournamentId) filters.push({ field: 'tournamentId', op: '==', value: tournamentId });
      if (status) filters.push({ field: 'status', op: '==', value: status });

      const queryResult = await MatchRepository.queryAdvanced({
        filters,
        orderBy: [{ field: 'dateTime', direction: 'asc' }],
        limit,
      });

      return ApiResponse.success(res, queryResult.results, 'Matches retrieved successfully.', 200, {
        limit,
        total: queryResult.total,
        hasNext: queryResult.hasNext,
      });
    } catch (e) { return next(e); }
  }

  async updateScore(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.params;
      const { teamAScore, teamBScore, status, details } = req.body;
      const result = await tournamentService.updateLiveScore(matchId, teamAScore, teamBScore, status, details);
      return ApiResponse.success(res, result, 'Match score updated successfully.');
    } catch (e) { return next(e); }
  }
}

export const tournamentController = new TournamentController();
export const matchController = new MatchController();
