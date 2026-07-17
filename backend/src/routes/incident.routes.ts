import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { createSecurityEventSchema, emergencyAlertSchema, medicalAlertSchema } from '../validators';
import { securityController, emergencyController, medicalController } from '../controllers/incident.controller';

const router = Router();

// Incident Reports
router.post('/security/incidents', authorizeRoles('Super Admin', 'Security Officer'), validateRequest(createSecurityEventSchema), securityController.createEvent);
router.put('/security/incidents/:id', authorizeRoles('Super Admin', 'Security Officer'), securityController.updateEvent);
router.get('/security/incidents', authorizeRoles('Super Admin', 'Security Officer'), securityController.listEvents);

// Emergency & Medical SOS dispatches
router.post('/emergency/broadcast', authorizeRoles('Super Admin', 'Security Officer'), validateRequest(emergencyAlertSchema), emergencyController.broadcastAlert);
router.post('/medical/dispatch', authorizeRoles('Super Admin', 'Medical Staff', 'Security Officer'), validateRequest(medicalAlertSchema), medicalController.dispatchMedical);

export default router;
