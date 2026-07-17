import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { createStadiumSchema } from '../validators';
import { stadiumController, parkingController, crowdController, weatherController, twinController } from '../controllers/stadium.controller';

const router = Router();

router.post(
  '/stadiums',
  authorizeRoles('Super Admin'),
  validateRequest(createStadiumSchema),
  stadiumController.createStadium
);
router.get('/stadiums/:stadiumId', stadiumController.getStadiumDetails);

// Parking Lot Operations
router.post('/parking/entry', authorizeRoles('Super Admin', 'Parking Staff'), parkingController.enterVehicle);
router.post('/parking/exit', authorizeRoles('Super Admin', 'Parking Staff'), parkingController.exitVehicle);
router.get('/parking/analytics', parkingController.getAnalytics);

// Crowd density telemetry
router.get('/crowd/density', crowdController.getDensity);

// Weather sensors telemetry
router.get('/weather/live', weatherController.getLiveWeather);

// Digital Twin physical status sync
router.get('/digital-twin/state', twinController.getTwinState);

export default router;
