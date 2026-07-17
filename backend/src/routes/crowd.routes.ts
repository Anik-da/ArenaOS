import { Router } from 'express';
import { crowdController } from '../controllers/crowd.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { crowdDensitySchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.post(
  '/report',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  validateRequest(crowdDensitySchema),
  crowdController.reportDensity
);

router.get(
  '/stadium/:stadiumId',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Fan', 'Guest'),
  crowdController.getCurrentDensity
);

router.get(
  '/stadium/:stadiumId/zone/:zoneId/history',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  crowdController.getZoneHistory
);

router.get(
  '/stadium/:stadiumId/surges',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  crowdController.getSurgeAlerts
);

router.get(
  '/stadium/:stadiumId/zones',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Fan', 'Guest'),
  crowdController.listZones
);

export default router;
