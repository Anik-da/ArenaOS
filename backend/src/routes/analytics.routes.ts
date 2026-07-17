import { Router } from 'express';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { analyticsController, reportController } from '../controllers/analytics.controller';

const router = Router();

router.get('/analytics/console', analyticsController.getConsoleStats);
router.post('/reports/export', authorizeRoles('Super Admin', 'Tournament Organizer'), reportController.exportReport);

export default router;
