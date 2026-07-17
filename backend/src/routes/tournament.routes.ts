import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import {
  createTournamentSchema, updateTournamentSchema, createMatchSchema,
  rescheduleMatchSchema, updateMatchScoreSchema, createTeamSchema,
  createPlayerSchema, createOfficialSchema, assignOfficialSchema,
  schedulePracticeSchema
} from '../validators';
import { tournamentController, matchController } from '../controllers/tournament.controller';

const router = Router();

// Tournament CRUD
router.post(
  '/tournaments',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(createTournamentSchema),
  tournamentController.createTournament
);
router.get('/tournaments', tournamentController.listTournaments);
router.get('/tournaments/:tournamentId', tournamentController.getTournamentById);
router.patch(
  '/tournaments/:tournamentId',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(updateTournamentSchema),
  tournamentController.updateTournament
);
router.delete('/tournaments/:tournamentId', authorizeRoles('Super Admin'), tournamentController.deleteTournament);

// Team CRUD
router.post(
  '/teams',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(createTeamSchema),
  tournamentController.createTeam
);
router.get('/teams', tournamentController.listTeams);

// Player CRUD
router.post(
  '/players',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(createPlayerSchema),
  tournamentController.createPlayer
);
router.get('/players', tournamentController.listPlayers);

// Official CRUD & Assignment
router.post(
  '/officials',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(createOfficialSchema),
  tournamentController.createOfficial
);
router.post(
  '/officials/assign',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(assignOfficialSchema),
  tournamentController.assignOfficial
);

// Practice Session Scheduling
router.post(
  '/practice/schedule',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(schedulePracticeSchema),
  tournamentController.schedulePractice
);

// Match Scheduling, Rescheduling & Score Updates
router.post(
  '/matches',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(createMatchSchema),
  matchController.scheduleMatch
);
router.patch(
  '/matches/:matchId/reschedule',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(rescheduleMatchSchema),
  matchController.rescheduleMatch
);
router.get('/matches', matchController.listMatches);
router.put(
  '/matches/:matchId/score',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(updateMatchScoreSchema),
  matchController.updateScore
);

export default router;
