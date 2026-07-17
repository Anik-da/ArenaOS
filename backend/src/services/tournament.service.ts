import { TournamentRepository, MatchRepository } from '../repositories/specialized.repository';
import { Tournament, Match } from '../models';
import logger from '../utilities/logger';

export class TournamentService {
  async createTournament(data: Omit<Tournament, 'id' | 'createdAt' | 'status'>) {
    logger.info(`Creating tournament: ${data.name}`);
    return TournamentRepository.create({
      ...data,
      status: 'planning',
      createdAt: new Date(),
    });
  }

  async getTournamentDetails(id: string) {
    const tournament = await TournamentRepository.getById(id);
    if (!tournament) throw new Error('Tournament not found.');
    
    // Find all matches for this tournament
    const matches = await MatchRepository.query('tournamentId', '==', id);
    return { ...tournament, matches };
  }

  async scheduleMatch(data: Omit<Match, 'id' | 'createdAt' | 'status' | 'score'>) {
    logger.info(`Scheduling match fixture between teams ${data.teamAId} and ${data.teamBId}`);
    return MatchRepository.create({
      ...data,
      status: 'scheduled',
      score: { teamAScore: 0, teamBScore: 0 },
      createdAt: new Date(),
    });
  }

  async updateLiveScore(matchId: string, teamAScore: number, teamBScore: number, status: string, details?: string) {
    logger.info(`Updating match ${matchId} live statistics score: ${teamAScore} - ${teamBScore}`);
    
    const match = await MatchRepository.getById(matchId);
    if (!match) throw new Error('Match not found.');

    const updatePayload: Partial<Match> = {
      score: { teamAScore, teamBScore, details },
      status: status as any,
    };

    await MatchRepository.update(matchId, updatePayload);
    return { ...match, ...updatePayload, id: matchId };
  }
}

export const tournamentService = new TournamentService();
export default tournamentService;
