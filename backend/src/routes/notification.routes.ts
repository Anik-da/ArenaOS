import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { sendNotificationSchema, broadcastNotificationSchema, markNotificationsReadSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.post(
  '/send',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  validateRequest(sendNotificationSchema),
  notificationController.send
);

router.post(
  '/broadcast',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  validateRequest(broadcastNotificationSchema),
  notificationController.broadcast
);

router.get(
  '/user',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Volunteer', 'Parking Staff', 'Fan', 'Guest'),
  notificationController.getUserNotifications
);

router.post(
  '/mark-read',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Volunteer', 'Parking Staff', 'Fan', 'Guest'),
  validateRequest(markNotificationsReadSchema),
  notificationController.markRead
);

router.post(
  '/mark-all-read',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Volunteer', 'Parking Staff', 'Fan', 'Guest'),
  notificationController.markAllRead
);

export default router;
