import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { createStadiumSchema, updateStadiumSchema } from '../validators';
import { stadiumController } from '../controllers/stadium.controller';

// Redirect legacy endpoints to their clean domain controllers
import { parkingController } from '../controllers/parking.controller';
import { crowdController } from '../controllers/crowd.controller';
import { weatherController } from '../controllers/weather.controller';
import { digitalTwinController } from '../controllers/digital-twin.controller';

const router = Router();

// Stadium CRUD
router.post(
  '/stadiums',
  authorizeRoles('Super Admin'),
  validateRequest(createStadiumSchema),
  stadiumController.createStadium
);
router.get('/stadiums', stadiumController.listStadiums);
router.get('/stadiums/:stadiumId', stadiumController.getStadiumDetails);
router.patch(
  '/stadiums/:stadiumId',
  authorizeRoles('Super Admin'),
  validateRequest(updateStadiumSchema),
  stadiumController.updateStadium
);
router.delete('/stadiums/:stadiumId', authorizeRoles('Super Admin'), stadiumController.deleteStadium);

// Legacy/Compatible parking routes
router.post('/parking/entry', authorizeRoles('Super Admin', 'Parking Staff'), parkingController.vehicleEntry);
router.post('/parking/exit', authorizeRoles('Super Admin', 'Parking Staff'), parkingController.vehicleExit);
router.get('/parking/analytics', parkingController.getAnalytics);

// Legacy/Compatible crowd density route
router.get('/crowd/density', (req, res, next) => {
  req.params = { ...req.params, stadiumId: (req.query.stadiumId as string) || 'stadium_main_1' };
  return crowdController.getCurrentDensity(req, res, next);
});

// Legacy/Compatible weather route
router.get('/weather/live', (req, res, next) => {
  req.params = { ...req.params, stadiumId: (req.query.stadiumId as string) || 'stadium_main_1' };
  return weatherController.getCurrentWeather(req, res, next);
});

// Legacy/Compatible digital twin route
router.get('/digital-twin/state', (req, res, next) => {
  req.params = { ...req.params, stadiumId: (req.query.stadiumId as string) || 'stadium_main_1' };
  return digitalTwinController.getState(req, res, next);
});

export default router;
