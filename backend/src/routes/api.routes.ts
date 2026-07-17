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

export default router;
