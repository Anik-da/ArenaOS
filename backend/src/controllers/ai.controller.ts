import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { aiService } from '../services/ai.service';
import ApiResponse from '../utilities/apiResponse';

export class AIController {
  /**
   * Submit prompt queries to neural co-pilot agent
   */
  async submitPrompt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const reply = await aiService.processUserQuery(req.user!.id, message);
      return ApiResponse.success(res, reply, 'AI query processed successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export const aiController = new AIController();
