import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { aiMessageSchema } from '../validators';
import { aiController } from '../controllers/ai.controller';

const router = Router();

router.post('/ai/chat', validateRequest(aiMessageSchema), aiController.submitPrompt);

export default router;
