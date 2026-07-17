import { TicketRepository, MatchRepository } from '../repositories/specialized.repository';
import { Ticket } from '../models';
import logger from '../utilities/logger';

class TicketService {
  async bookTicket(userId: string, data: Omit<Ticket, 'id' | 'userId' | 'qrCode' | 'status' | 'createdAt'>) {
    logger.info(`Booking ticket for user ${userId} on match ${data.matchId}`);
    
    const match = await MatchRepository.getById(data.matchId);
    if (!match) throw new Error('Match fixture does not exist.');

    const queryResult = await TicketRepository.queryAdvanced({
      filters: [
        { field: 'matchId', op: '==', value: data.matchId },
        { field: 'seatNumber', op: '==', value: data.seatNumber },
        { field: 'status', op: '==', value: 'booked' }
      ],
      limit: 1
    });
    const isTaken = queryResult.results.length > 0;
    if (isTaken) {
      throw new Error(`Seat ${data.seatNumber} is already booked for this match.`);
    }

    const qrPayload = JSON.stringify({
      matchId: data.matchId,
      seatNumber: data.seatNumber,
      userId,
      timestamp: new Date().getTime(),
    });
    const qrCode = Buffer.from(qrPayload).toString('base64');

    return TicketRepository.create({
      ...data,
      userId,
      qrCode,
      status: 'booked',
      createdAt: new Date(),
    });
  }

  async validateTicket(qrCode: string) {
    logger.info(`Scanning and validating QR ticket entry.`);
    
    const tickets = await TicketRepository.query('qrCode', '==', qrCode);
    if (tickets.length === 0) {
      throw new Error('Invalid ticket QR code hash format.');
    }

    const ticket = tickets[0];
    if (ticket.status === 'validated') {
      throw new Error(`Ticket already validated at gate check-in on ${ticket.validatedAt}`);
    }
    if (ticket.status === 'cancelled') {
      throw new Error('Ticket check-in blocked: Ticket is cancelled.');
    }

    const updatePayload: Partial<Ticket> = {
      status: 'validated',
      validatedAt: new Date(),
    };

    await TicketRepository.update(ticket.id!, updatePayload);
    return { ...ticket, ...updatePayload };
  }

  async getUserTickets(userId: string, options: any) {
    return await TicketRepository.queryAdvanced(options);
  }

  async cancelTicket(ticketId: string, userId: string) {
    const ticket = await TicketRepository.getById(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    if (ticket.userId !== userId) throw new Error('Unauthorised to cancel this ticket');

    await TicketRepository.update(ticketId, { status: 'cancelled' });
    return { ticketId, status: 'cancelled' };
  }

  async getTicketStats(matchId: string) {
    const all = await TicketRepository.query('matchId', '==', matchId);
    return {
      matchId,
      totalSold: all.length,
      validatedCount: all.filter(t => t.status === 'validated').length,
      cancelledCount: all.filter(t => t.status === 'cancelled').length,
      totalRevenue: all.reduce((sum, t) => sum + (t.price || 0), 0),
    };
  }
}

export const ticketService = new TicketService();
export default ticketService;
