import { Router } from 'express';
import { weatherController } from '../controllers/weather.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';

const router = Router();

router.use(authMiddleware);

router.get(
  '/stadium/:stadiumId',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Fan', 'Guest'),
  weatherController.getCurrentWeather
);

router.get(
  '/stadium/:stadiumId/forecast',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Fan', 'Guest'),
  weatherController.getForecast
);

router.get(
  '/stadium/:stadiumId/alerts',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Fan', 'Guest'),
  weatherController.getAlerts
);

router.get(
  '/stadium/:stadiumId/rain-prediction',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Fan', 'Guest'),
  weatherController.getRainPrediction
);

export default router;
