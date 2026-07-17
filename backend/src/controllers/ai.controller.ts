import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { aiService } from '../services/ai.service';
import ApiResponse from '../utilities/apiResponse';

export class AIController {
  async submitPrompt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { message, context, model } = req.body;
      const reply = await aiService.sendMessage(req.user!.id, message, context, model);
      return ApiResponse.success(res, reply, 'AI query processed successfully.');
    } catch (e) { return next(e); }
  }

  async listConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await aiService.listConversations(userId);
      return ApiResponse.success(res, result, 'AI conversations list retrieved.');
    } catch (e) { return next(e); }
  }

  async getConversationHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const result = await aiService.getConversationHistory(conversationId);
      return ApiResponse.success(res, result, 'Conversation history retrieved.');
    } catch (e) { return next(e); }
  }

  async naturalLanguageQuery(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { query, domain } = req.body;
      const result = await aiService.naturalLanguageQuery(query, domain);
      return ApiResponse.success(res, result, 'Natural language query parsed successfully.');
    } catch (e) { return next(e); }
  }

  async generateReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await aiService.generateReport(req.body);
      return ApiResponse.success(res, result, 'AI-synthesized report compiled successfully.', 201);
    } catch (e) { return next(e); }
  }

  async analyzeVision(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await aiService.analyzeVision(req.body);
      return ApiResponse.success(res, result, 'Vision analysis completed successfully.');
    } catch (e) { return next(e); }
  }

  async predict(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await aiService.predict(req.body);
      return ApiResponse.success(res, result, 'Telemetry forecasting predictions compiled.');
    } catch (e) { return next(e); }
  }
}

export const aiController = new AIController();
