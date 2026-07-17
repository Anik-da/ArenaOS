import { Router } from 'express';
import { emergencyController } from '../controllers/emergency.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { emergencyAlertSchema, sosAlertSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.post(
  '/alert',
  authorizeRoles('Super Admin', 'Security Officer'),
  validateRequest(emergencyAlertSchema),
  emergencyController.createAlert
);

router.get(
  '/alerts',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Fan', 'Guest'),
  emergencyController.listAlerts
);

router.get(
  '/alerts/active',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Fan', 'Guest'),
  emergencyController.getActiveAlerts
);

router.patch(
  '/alert/:alertId',
  authorizeRoles('Super Admin', 'Security Officer'),
  emergencyController.updateAlert
);

router.post(
  '/alert/:alertId/broadcast',
  authorizeRoles('Super Admin', 'Security Officer'),
  emergencyController.broadcastAlert
);

router.post(
  '/sos',
  authorizeRoles('Super Admin', 'Fan', 'Guest'),
  validateRequest(sosAlertSchema),
  emergencyController.handleSOS
);

export default router;
