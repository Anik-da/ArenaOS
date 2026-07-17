import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { createTournamentSchema, createMatchSchema, updateMatchScoreSchema } from '../validators';
import { tournamentController, matchController } from '../controllers/tournament.controller';

const router = Router();

router.post(
  '/tournaments',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(createTournamentSchema),
  tournamentController.createTournament
);

router.post(
  '/matches',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(createMatchSchema),
  matchController.scheduleMatch
);

router.get('/matches', matchController.listMatches);

router.put(
  '/matches/:matchId/score',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(updateMatchScoreSchema),
  matchController.updateScore
);

export default router;
