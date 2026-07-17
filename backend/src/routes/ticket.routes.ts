import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { bookTicketSchema, validateTicketSchema, cancelTicketSchema } from '../validators';
import { ticketController } from '../controllers/ticket.controller';

const router = Router();

router.post('/tickets/book', validateRequest(bookTicketSchema), ticketController.bookTicket);
router.post(
  '/tickets/validate',
  authorizeRoles('Super Admin', 'Volunteer', 'Security Officer'),
  validateRequest(validateTicketSchema),
  ticketController.validateTicket
);
router.get('/tickets', ticketController.listUserTickets);
router.get('/tickets/:ticketId', ticketController.getTicketById);
router.post(
  '/tickets/:ticketId/cancel',
  validateRequest(cancelTicketSchema),
  ticketController.cancelTicket
);
router.post(
  '/tickets/:ticketId/refund',
  authorizeRoles('Super Admin'),
  ticketController.refundTicket
);
router.get(
  '/tickets/match/:matchId/stats',
  authorizeRoles('Super Admin', 'Tournament Organizer'),
  ticketController.getTicketStats
);

export default router;
