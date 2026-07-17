import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { MatchRepository } from '../repositories/specialized.repository';
import { tournamentService } from '../services/tournament.service';
import ApiResponse from '../utilities/apiResponse';

export class TournamentController {
  /**
   * Register a new tournament setup
   */
  async createTournament(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await tournamentService.createTournament({
        ...req.body,
        organizerId: req.user!.id,
      });
      return ApiResponse.success(res, result, 'Tournament created successfully.', 201);
    } catch (e) {
      return next(e);
    }
  }
}

export class MatchController {
  /**
   * Schedule a new match fixture
   */
  async scheduleMatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await tournamentService.scheduleMatch(req.body);
      return ApiResponse.success(res, result, 'Match scheduled successfully.', 201);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * List match fixtures with advanced filtering (by tournamentId or status), sorting, and pagination
   */
  async listMatches(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tournamentId = req.query.tournamentId as string;
      const status = req.query.status as string;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const filters: any[] = [];
      if (tournamentId) {
        filters.push({ field: 'tournamentId', op: '==', value: tournamentId });
      }
      if (status) {
        filters.push({ field: 'status', op: '==', value: status });
      }

      const queryResult = await MatchRepository.queryAdvanced({
        filters,
        orderBy: [{ field: 'dateTime', direction: 'asc' }],
        limit,
      });

      return ApiResponse.success(
        res,
        queryResult.results,
        'Matches retrieved successfully.',
        200,
        {
          limit,
          total: queryResult.total,
          hasNext: queryResult.hasNext,
        }
      );
    } catch (e) {
      return next(e);
    }
  }

  /**
   * Update match score and status in real-time
   */
  async updateScore(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.params;
      const { teamAScore, teamBScore, status, details } = req.body;
      const result = await tournamentService.updateLiveScore(matchId, teamAScore, teamBScore, status, details);
      return ApiResponse.success(res, result, 'Match score updated successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export const tournamentController = new TournamentController();
export const matchController = new MatchController();
