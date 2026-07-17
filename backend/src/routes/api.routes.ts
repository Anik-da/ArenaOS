import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import tournamentRoutes from './tournament.routes';
import stadiumRoutes from './stadium.routes';
import incidentRoutes from './incident.routes';
import ticketRoutes from './ticket.routes';
import analyticsRoutes from './analytics.routes';
import aiRoutes from './ai.routes';
import crowdRoutes from './crowd.routes';
import parkingRoutes from './parking.routes';
import weatherRoutes from './weather.routes';
import emergencyRoutes from './emergency.routes';
import medicalRoutes from './medical.routes';
import notificationRoutes from './notification.routes';
import settingsRoutes from './settings.routes';
import digitalTwinRoutes from './digital-twin.routes';
import reportRoutes from './report.routes';
import fanRoutes from './fan.routes';
import utilityRoutes from './utility.routes';

const router = Router();

// 1. PUBLIC ROUTES (Authentication & sessions)
router.use('/auth', authRoutes);

// 2. AUTHENTICATED ROUTES (Require Bearer JWT / Firebase token)
router.use(authMiddleware);
router.use(userRoutes);
router.use(tournamentRoutes);
router.use(stadiumRoutes);
router.use(incidentRoutes);
router.use(ticketRoutes);
router.use(analyticsRoutes);
router.use(aiRoutes);
router.use('/crowd', crowdRoutes);
router.use('/parking', parkingRoutes);
router.use('/weather', weatherRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/medical', medicalRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);
router.use('/digital-twin', digitalTwinRoutes);
router.use('/reports', reportRoutes);
router.use('/fans', fanRoutes);
router.use('/utilities', utilityRoutes);

export default router;
