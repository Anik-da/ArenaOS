import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { generateReportSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.post(
  '/generate',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(generateReportSchema),
  reportController.generate
);

router.get(
  '/list',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  reportController.listReports
);

router.get(
  '/download/:reportId',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  reportController.downloadReport
);

export default router;
