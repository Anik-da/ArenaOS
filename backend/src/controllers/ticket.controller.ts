import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ticketService } from '../services/ticket.service';
import { TicketRepository } from '../repositories/specialized.repository';
import ApiResponse from '../utilities/apiResponse';

export class TicketController {
  async bookTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ticketService.bookTicket(req.user!.id, req.body);
      return ApiResponse.success(res, result, 'Ticket booked successfully.', 201);
    } catch (e) { return next(e); }
  }

  async validateTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { qrCode } = req.body;
      const result = await ticketService.validateTicket(qrCode);
      return ApiResponse.success(res, result, 'Ticket validated. Entry granted.');
    } catch (e) { return next(e); }
  }

  async listUserTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await ticketService.getUserTickets(userId, {
        filters: [{ field: 'userId', op: '==', value: userId }],
        orderBy: [{ field: 'createdAt', direction: 'desc' }],
        limit
      });
      return ApiResponse.success(res, result.results, 'Tickets retrieved successfully.', 200, {
        total: result.total,
        hasNext: result.hasNext
      });
    } catch (e) { return next(e); }
  }

  async getTicketById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { ticketId } = req.params;
      const result = await TicketRepository.getById(ticketId);
      if (!result) return ApiResponse.error(res, 'Ticket not found.', 404);
      return ApiResponse.success(res, result, 'Ticket details retrieved successfully.');
    } catch (e) { return next(e); }
  }

  async cancelTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { ticketId } = req.params;
      const userId = req.user!.id;
      const result = await ticketService.cancelTicket(ticketId, userId);
      return ApiResponse.success(res, result, 'Ticket cancelled successfully.');
    } catch (e) { return next(e); }
  }

  async refundTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { ticketId } = req.params;
      // Mark as refunded (Super Admin only)
      await TicketRepository.update(ticketId, { status: 'refunded' });
      return ApiResponse.success(res, { id: ticketId, status: 'refunded' }, 'Ticket refunded successfully.');
    } catch (e) { return next(e); }
  }

  async getTicketStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.params;
      const result = await ticketService.getTicketStats(matchId);
      return ApiResponse.success(res, result, 'Ticketing statistics compiled successfully.');
    } catch (e) { return next(e); }
  }
}

export const ticketController = new TicketController();
