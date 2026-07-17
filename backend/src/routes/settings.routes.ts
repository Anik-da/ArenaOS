import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { updateSettingSchema, bulkUpdateSettingsSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.get(
  '/key/:key',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  settingsController.get
);

router.post(
  '/update',
  authorizeRoles('Super Admin'),
  validateRequest(updateSettingSchema),
  settingsController.update
);

router.post(
  '/bulk-update',
  authorizeRoles('Super Admin'),
  validateRequest(bulkUpdateSettingsSchema),
  settingsController.bulkUpdate
);

router.get(
  '/list',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  settingsController.list
);

export default router;
