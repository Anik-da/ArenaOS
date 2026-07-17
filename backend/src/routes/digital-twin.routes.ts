import { Router } from 'express';
import { digitalTwinController } from '../controllers/digital-twin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { updateDigitalTwinSchema, updateGateStatusSchema, updateSeatMapSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.get(
  '/stadium/:stadiumId/state',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Fan', 'Guest'),
  digitalTwinController.getState
);

router.post(
  '/stadium/:stadiumId/layers',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  validateRequest(updateDigitalTwinSchema),
  digitalTwinController.updateLayers
);

router.get(
  '/stadium/:stadiumId/seats',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Fan', 'Guest'),
  digitalTwinController.getSeatMap
);

router.post(
  '/stadium/:stadiumId/seats/update',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(updateSeatMapSchema),
  digitalTwinController.updateSeatMap
);

router.get(
  '/stadium/:stadiumId/gates',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Fan', 'Guest'),
  digitalTwinController.getGateStatus
);

router.post(
  '/stadium/:stadiumId/gates/update',
  authorizeRoles('Super Admin', 'Security Officer'),
  validateRequest(updateGateStatusSchema),
  digitalTwinController.updateGateStatus
);

router.get(
  '/stadium/:stadiumId/drones',
  authorizeRoles('Super Admin', 'Security Officer'),
  digitalTwinController.getDronePositions
);

router.get(
  '/stadium/:stadiumId/cameras',
  authorizeRoles('Super Admin', 'Security Officer'),
  digitalTwinController.getCameraPositions
);

router.get(
  '/stadium/:stadiumId/emergency-vehicles',
  authorizeRoles('Super Admin', 'Security Officer', 'Medical Staff'),
  digitalTwinController.getEmergencyVehicles
);

router.get(
  '/stadium/:stadiumId/crowd-zones',
  authorizeRoles('Super Admin', 'Security Officer', 'Fan', 'Guest'),
  digitalTwinController.getCrowdZones
);

export default router;
