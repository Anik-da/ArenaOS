import { z } from 'zod';

// Auth & User validations
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    role: z.enum(['Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Volunteer', 'Parking Staff', 'Fan', 'Guest']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password is too short.'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phoneNumber: z.string().optional(),
    photoUrl: z.string().url().optional(),
    role: z.enum(['Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Volunteer', 'Parking Staff', 'Fan', 'Guest']).optional(),
    permissions: z.array(z.string()).optional(),
  }),
});

// Tournament & Match validations
export const createTournamentSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    sport: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
});

export const createMatchSchema = z.object({
  body: z.object({
    tournamentId: z.string(),
    teamAId: z.string(),
    teamBId: z.string(),
    venueId: z.string(),
    dateTime: z.string().datetime(),
    refereeId: z.string().optional(),
  }),
});

export const updateMatchScoreSchema = z.object({
  body: z.object({
    teamAScore: z.number().int().min(0),
    teamBScore: z.number().int().min(0),
    status: z.enum(['scheduled', 'live', 'completed', 'delayed', 'cancelled']),
    details: z.string().optional(),
  }),
});

// Stadium & Parking
export const createStadiumSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    city: z.string(),
    country: z.string(),
    capacity: z.number().int().positive(),
    gateCount: z.number().int().min(1),
    lat: z.number(),
    lng: z.number(),
  }),
});

export const updateParkingSchema = z.object({
  body: z.object({
    status: z.enum(['vacant', 'occupied', 'ev-charging']),
    vehiclePlate: z.string().optional(),
  }),
});

// Ticket Booking
export const bookTicketSchema = z.object({
  body: z.object({
    matchId: z.string(),
    seatNumber: z.string(),
    zone: z.string(),
    gate: z.string(),
    price: z.number().positive(),
  }),
});

export const validateTicketSchema = z.object({
  body: z.object({
    qrCode: z.string(),
  }),
});

// Incidents & Security
export const createSecurityEventSchema = z.object({
  body: z.object({
    type: z.enum(['restricted_area_breach', 'abandoned_object', 'fire_alert', 'crowd_surge', 'general_alert']),
    zoneId: z.string(),
    severity: z.enum(['low', 'medium', 'critical']),
    description: z.string(),
  }),
});

// Emergency & Medical SOS
export const medicalAlertSchema = z.object({
  body: z.object({
    type: z.enum(['cardiac_arrest', 'heat_exhaustion', 'injury', 'other']),
    patientName: z.string().optional(),
    ambulanceId: z.string().optional(),
  }),
});

export const emergencyAlertSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    severity: z.enum(['info', 'warn', 'critical']),
    broadcastScope: z.enum(['all', 'staff', 'security']),
  }),
});

// AI conversations
export const aiMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty.'),
  }),
});
