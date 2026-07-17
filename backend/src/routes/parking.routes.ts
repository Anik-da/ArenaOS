import { Router } from 'express';
import { parkingController } from '../controllers/parking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { parkingEntrySchema, parkingExitSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.post(
  '/entry',
  authorizeRoles('Super Admin', 'Parking Staff'),
  validateRequest(parkingEntrySchema),
  parkingController.vehicleEntry
);

router.post(
  '/exit',
  authorizeRoles('Super Admin', 'Parking Staff'),
  validateRequest(parkingExitSchema),
  parkingController.vehicleExit
);

router.get(
  '/stadium/:stadiumId/slots',
  authorizeRoles('Super Admin', 'Parking Staff', 'Fan', 'Guest'),
  parkingController.listSlots
);

router.get(
  '/stadium/:stadiumId/revenue',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  parkingController.getRevenue
);

router.get(
  '/stadium/:stadiumId/analytics',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Parking Staff'),
  parkingController.getAnalytics
);

router.get(
  '/stadium/:stadiumId/ev-stations',
  authorizeRoles('Super Admin', 'Parking Staff', 'Fan', 'Guest'),
  parkingController.getEVStations
);

export default router;
