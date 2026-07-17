import { Router } from 'express';
import { utilityController } from '../controllers/utility.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { reportLeakSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.get(
  '/stadium/:stadiumId/energy',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  utilityController.getEnergy
);

router.get(
  '/stadium/:stadiumId/water',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  utilityController.getWater
);

router.get(
  '/stadium/:stadiumId/energy/analytics',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  utilityController.getEnergyAnalytics
);

router.get(
  '/stadium/:stadiumId/water/analytics',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  utilityController.getWaterAnalytics
);

router.post(
  '/stadium/:stadiumId/water/leak',
  authorizeRoles('Super Admin', 'Security Officer', 'Volunteer'),
  validateRequest(reportLeakSchema),
  utilityController.reportLeak
);

export default router;
