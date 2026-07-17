import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import logger from '../utilities/logger';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, role } = req.body;
      const result = await authService.register({ email, name, role });
      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: result,
      });
    } catch (error: any) {
      logger.error(`Registration controller error: ${error.message}`);
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.login(email);
      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
      });
    } catch (error: any) {
      logger.error(`Login controller error: ${error.message}`);
      return next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required.' });
      }
      const result = await authService.refreshToken(refreshToken);
      return res.status(200).json({
        success: true,
        message: 'Access token refreshed successfully.',
        data: result,
      });
    } catch (error: any) {
      logger.error(`Refresh controller error: ${error.message}`);
      return next(error);
    }
  }
}

export const authController = new AuthController();
export default authController;
