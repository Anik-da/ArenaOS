import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ticketService } from '../services/ticket.service';
import ApiResponse from '../utilities/apiResponse';

export class TicketController {
  /**
   * Book a ticket for a match
   */
  async bookTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ticketService.bookTicket(req.user!.id, req.body);
      return ApiResponse.success(res, result, 'Ticket booked successfully.', 201);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * Validate a ticket via QR code scan at entrance gate
   */
  async validateTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { qrCode } = req.body;
      const result = await ticketService.validateTicket(qrCode);
      return ApiResponse.success(res, result, 'Ticket validated. Entry granted.');
    } catch (e) {
      return next(e);
    }
  }
}

export const ticketController = new TicketController();
