import { Router } from 'express';
import { medicalController } from '../controllers/medical.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { medicalAlertSchema, dispatchAmbulanceSchema, assignDoctorSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.post(
  '/case',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Volunteer', 'Fan'),
  validateRequest(medicalAlertSchema),
  medicalController.createCase
);

router.post(
  '/dispatch',
  authorizeRoles('Super Admin', 'Medical Staff'),
  validateRequest(dispatchAmbulanceSchema),
  medicalController.dispatchAmbulance
);

router.post(
  '/assign-doctor',
  authorizeRoles('Super Admin', 'Medical Staff'),
  validateRequest(assignDoctorSchema),
  medicalController.assignDoctor
);

router.patch(
  '/case/:caseId/status',
  authorizeRoles('Super Admin', 'Medical Staff'),
  medicalController.updatePatientStatus
);

router.get(
  '/stadium/:stadiumId/queue',
  authorizeRoles('Super Admin', 'Medical Staff'),
  medicalController.getPatientQueue
);

router.get(
  '/stadium/:stadiumId/metrics',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Medical Staff'),
  medicalController.getResponseMetrics
);

router.get(
  '/cases',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Medical Staff'),
  medicalController.listCases
);

export default router;
