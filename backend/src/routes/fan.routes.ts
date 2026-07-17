import { Router } from 'express';
import { fanController } from '../controllers/fan.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { updateFanProfileSchema, sosAlertSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.get(
  '/profile',
  authorizeRoles('Super Admin', 'Fan'),
  fanController.getProfile
);

router.patch(
  '/profile',
  authorizeRoles('Super Admin', 'Fan'),
  validateRequest(updateFanProfileSchema),
  fanController.updateProfile
);

router.get(
  '/tickets',
  authorizeRoles('Super Admin', 'Fan'),
  fanController.getTickets
);

router.get(
  '/orders',
  authorizeRoles('Super Admin', 'Fan'),
  fanController.getOrders
);

router.get(
  '/favorites',
  authorizeRoles('Super Admin', 'Fan'),
  fanController.getFavorites
);

router.post(
  '/sos',
  authorizeRoles('Super Admin', 'Fan', 'Guest'),
  validateRequest(sosAlertSchema),
  fanController.sendSOS
);

export default router;
