import { Router } from 'express';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../validators';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/register', authRateLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refresh);

export default router;
