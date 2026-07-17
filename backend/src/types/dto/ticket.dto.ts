/**
 * ARES AI Platform — Ticket DTOs
 */

export interface BookTicketDTO {
  matchId: string;
  seatNumber: string;
  zone: string;
  gate: string;
  price: number;
  currency?: string;
}

export interface ValidateTicketDTO {
  qrCode: string;
}

export interface CancelTicketDTO {
  reason?: string;
}

export interface TicketResponseDTO {
  id: string;
  matchId: string;
  userId: string;
  qrCode: string;
  seatNumber: string;
  zone: string;
  gate: string;
  price: number;
  currency: string;
  status: string;
  validatedAt?: Date;
  createdAt: Date;
}
