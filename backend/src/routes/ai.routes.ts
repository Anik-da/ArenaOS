import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import {
  aiMessageSchema, naturalLanguageQuerySchema, generateReportSchema,
  visionAnalysisSchema, predictionRequestSchema
} from '../validators';
import { aiController } from '../controllers/ai.controller';

const router = Router();

router.post('/ai/chat', validateRequest(aiMessageSchema), aiController.submitPrompt);
router.get('/ai/conversations', aiController.listConversations);
router.get('/ai/conversations/:conversationId', aiController.getConversationHistory);

router.post(
  '/ai/query',
  authorizeRoles('Super Admin', 'Tournament Organizer', 'Security Officer'),
  validateRequest(naturalLanguageQuerySchema),
  aiController.naturalLanguageQuery
);

router.post(
  '/ai/report',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(generateReportSchema),
  aiController.generateReport
);

router.post(
  '/ai/vision',
  authorizeRoles('Super Admin', 'Security Officer'),
  validateRequest(visionAnalysisSchema),
  aiController.analyzeVision
);

router.post(
  '/ai/predict',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  validateRequest(predictionRequestSchema),
  aiController.predict
);

export default router;
