import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { authorizeRoles } from '../middlewares/authorize.middleware';
import { bookTicketSchema, validateTicketSchema } from '../validators';
import { ticketController } from '../controllers/ticket.controller';

const router = Router();

router.post('/tickets/book', validateRequest(bookTicketSchema), ticketController.bookTicket);
router.post(
  '/tickets/validate',
  authorizeRoles('Super Admin', 'Volunteer'),
  validateRequest(validateTicketSchema),
  ticketController.validateTicket
);

export default router;
