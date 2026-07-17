import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { updateUserSchema } from '../validators';
import { userController, settingController, notificationController } from '../controllers/user.controller';
import { authorizeRoles } from '../middlewares/authorize.middleware';

const router = Router();

router.get('/users/profile', userController.getProfile);
router.put('/users/profile', validateRequest(updateUserSchema), userController.updateProfile);
router.put('/settings', authorizeRoles('Super Admin'), settingController.updateSetting);
router.get('/notifications/feed', notificationController.listUserFeed);

export default router;
