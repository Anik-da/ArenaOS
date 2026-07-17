import { z } from 'zod';

// ================================================
// AUTH & USER VALIDATIONS
// ================================================

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    role: z.enum(['Super Admin', 'Tournament Organizer', 'Security Officer', 'Medical Staff', 'Volunteer', 'Parking Staff', 'Fan', 'Guest']).optional(),
    phoneNumber: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password is too short.'),
  }),
});

export const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'ID token is required.'),
  }),
});

export const otpLoginSchema = z.object({
  body: z.object({
    phoneNumber: z.string().min(10, 'Valid phone number required.'),
    otp: z.string().length(6, 'OTP must be 6 digits.'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required.'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
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

// ================================================
// TOURNAMENT & MATCH VALIDATIONS
// ================================================

export const createTournamentSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    sport: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    description: z.string().optional(),
    logoUrl: z.string().url().optional(),
  }),
});

export const updateTournamentSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    sport: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.enum(['planning', 'active', 'completed', 'cancelled']).optional(),
    description: z.string().optional(),
    logoUrl: z.string().url().optional(),
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

export const rescheduleMatchSchema = z.object({
  body: z.object({
    dateTime: z.string().datetime(),
    venueId: z.string().optional(),
    reason: z.string().min(1, 'Reason for rescheduling is required.'),
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

// ================================================
// TEAM & PLAYER VALIDATIONS
// ================================================

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    code: z.string().min(2).max(5),
    country: z.string(),
    logoUrl: z.string().url().optional(),
    tournamentId: z.string().optional(),
  }),
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    code: z.string().min(2).max(5).optional(),
    country: z.string().optional(),
    logoUrl: z.string().url().optional(),
  }),
});

export const createPlayerSchema = z.object({
  body: z.object({
    teamId: z.string(),
    name: z.string().min(2),
    jerseyNumber: z.number().int().min(0).max(99),
    position: z.string(),
    nationality: z.string().optional(),
    dateOfBirth: z.string().optional(),
    stats: z.record(z.any()).optional(),
  }),
});

export const updatePlayerSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    jerseyNumber: z.number().int().min(0).max(99).optional(),
    position: z.string().optional(),
    stats: z.record(z.any()).optional(),
  }),
});

// ================================================
// OFFICIAL VALIDATIONS
// ================================================

export const createOfficialSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    role: z.enum(['referee', 'linesman', 'var_referee', 'match_commissioner']),
    licenseNumber: z.string(),
    nationality: z.string().optional(),
  }),
});

export const assignOfficialSchema = z.object({
  body: z.object({
    matchId: z.string(),
    officialId: z.string(),
    role: z.enum(['referee', 'linesman', 'var_referee', 'match_commissioner']),
  }),
});

// ================================================
// STADIUM & VENUE VALIDATIONS
// ================================================

export const createStadiumSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    city: z.string(),
    country: z.string(),
    capacity: z.number().int().positive(),
    gateCount: z.number().int().min(1),
    lat: z.number(),
    lng: z.number(),
    layoutUrl: z.string().url().optional(),
  }),
});

export const updateStadiumSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    capacity: z.number().int().positive().optional(),
    gateCount: z.number().int().min(1).optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    smartSensorsConnected: z.number().int().optional(),
  }),
});

export const createVenueSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    city: z.string(),
    country: z.string(),
    capacity: z.number().int().positive(),
    layoutUrl: z.string().url().optional(),
  }),
});

// ================================================
// CROWD DENSITY VALIDATIONS
// ================================================

export const crowdDensitySchema = z.object({
  body: z.object({
    stadiumId: z.string(),
    zoneId: z.string(),
    currentDensity: z.number().min(0).max(100),
    occupancyCount: z.number().int().min(0),
  }),
});

// ================================================
// PARKING VALIDATIONS
// ================================================

export const parkingEntrySchema = z.object({
  body: z.object({
    stadiumId: z.string(),
    slotId: z.string(),
    vehiclePlate: z.string().min(1, 'Vehicle plate is required.'),
    type: z.enum(['standard', 'vip', 'ev']).optional(),
  }),
});

export const parkingExitSchema = z.object({
  body: z.object({
    slotId: z.string(),
    vehiclePlate: z.string(),
  }),
});

export const updateParkingSchema = z.object({
  body: z.object({
    status: z.enum(['vacant', 'occupied', 'ev-charging']),
    vehiclePlate: z.string().optional(),
  }),
});

// ================================================
// TICKET VALIDATIONS
// ================================================

export const bookTicketSchema = z.object({
  body: z.object({
    matchId: z.string(),
    seatNumber: z.string(),
    zone: z.string(),
    gate: z.string(),
    price: z.number().positive(),
    currency: z.string().length(3).optional(),
  }),
});

export const validateTicketSchema = z.object({
  body: z.object({
    qrCode: z.string(),
  }),
});

export const cancelTicketSchema = z.object({
  body: z.object({
    reason: z.string().optional(),
  }),
});

// ================================================
// SECURITY & INCIDENT VALIDATIONS
// ================================================

export const createSecurityEventSchema = z.object({
  body: z.object({
    stadiumId: z.string().optional(),
    type: z.enum(['restricted_area_breach', 'abandoned_object', 'fire_alert', 'crowd_surge', 'general_alert']),
    zoneId: z.string(),
    severity: z.enum(['low', 'medium', 'critical']),
    description: z.string(),
  }),
});

export const updateSecurityEventSchema = z.object({
  body: z.object({
    status: z.enum(['open', 'investigating', 'resolved']).optional(),
    assignedResponderId: z.string().optional(),
    resolutionNotes: z.string().optional(),
  }),
});

// ================================================
// EMERGENCY & MEDICAL VALIDATIONS
// ================================================

export const medicalAlertSchema = z.object({
  body: z.object({
    stadiumId: z.string(),
    type: z.enum(['cardiac_arrest', 'heat_exhaustion', 'injury', 'other']),
    patientName: z.string().optional(),
    zoneId: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const dispatchAmbulanceSchema = z.object({
  body: z.object({
    medicalEventId: z.string(),
    ambulanceId: z.string(),
  }),
});

export const assignDoctorSchema = z.object({
  body: z.object({
    medicalEventId: z.string(),
    doctorId: z.string(),
  }),
});

export const emergencyAlertSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    severity: z.enum(['info', 'warn', 'critical']),
    broadcastScope: z.enum(['all', 'staff', 'security']),
    stadiumId: z.string().optional(),
  }),
});

export const sosAlertSchema = z.object({
  body: z.object({
    stadiumId: z.string(),
    zoneId: z.string().optional(),
    message: z.string().optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
});

// ================================================
// NOTIFICATION VALIDATIONS
// ================================================

export const sendNotificationSchema = z.object({
  body: z.object({
    userId: z.string(),
    title: z.string(),
    body: z.string(),
    type: z.enum(['emergency', 'security', 'parking', 'medical', 'general']),
    data: z.record(z.any()).optional(),
  }),
});

export const broadcastNotificationSchema = z.object({
  body: z.object({
    title: z.string(),
    body: z.string(),
    type: z.enum(['emergency', 'security', 'parking', 'medical', 'general']),
    targetRole: z.string().optional(),
    stadiumId: z.string().optional(),
    data: z.record(z.any()).optional(),
  }),
});

export const markNotificationsReadSchema = z.object({
  body: z.object({
    notificationIds: z.array(z.string()).min(1),
  }),
});

// ================================================
// SETTINGS VALIDATIONS
// ================================================

export const updateSettingSchema = z.object({
  body: z.object({
    key: z.string(),
    value: z.any(),
    description: z.string().optional(),
  }),
});

export const bulkUpdateSettingsSchema = z.object({
  body: z.object({
    settings: z.array(z.object({
      key: z.string(),
      value: z.any(),
    })).min(1),
  }),
});

// ================================================
// REPORT VALIDATIONS
// ================================================

export const generateReportSchema = z.object({
  body: z.object({
    type: z.enum(['daily', 'weekly', 'monthly', 'custom']),
    format: z.enum(['pdf', 'excel', 'csv']),
    stadiumId: z.string().optional(),
    tournamentId: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    sections: z.array(z.string()).optional(),
  }),
});

// ================================================
// DIGITAL TWIN VALIDATIONS
// ================================================

export const updateDigitalTwinSchema = z.object({
  body: z.object({
    stadiumId: z.string(),
    layersActive: z.array(z.string()),
  }),
});

export const updateGateStatusSchema = z.object({
  body: z.object({
    gateId: z.string(),
    status: z.enum(['open', 'closed', 'restricted', 'emergency_only']),
  }),
});

// ================================================
// ENERGY & WATER VALIDATIONS
// ================================================

export const energyReadingSchema = z.object({
  body: z.object({
    stadiumId: z.string(),
    gridPowerKW: z.number().min(0),
    solarPowerKW: z.number().min(0),
    generatorPowerKW: z.number().min(0),
    batteryBackupPct: z.number().min(0).max(100),
  }),
});

export const waterReadingSchema = z.object({
  body: z.object({
    stadiumId: z.string(),
    consumptionLiters: z.number().min(0),
    storageLiters: z.number().min(0),
    leakDetected: z.boolean(),
    leakSector: z.string().optional(),
  }),
});

export const reportLeakSchema = z.object({
  body: z.object({
    stadiumId: z.string(),
    sector: z.string(),
    severity: z.enum(['low', 'medium', 'critical']),
    description: z.string().optional(),
  }),
});

// ================================================
// DRONE FEED VALIDATIONS
// ================================================

export const updateDroneFeedSchema = z.object({
  body: z.object({
    droneId: z.string(),
    stadiumId: z.string(),
    status: z.enum(['patrolling', 'charging', 'tracking']),
    batteryPct: z.number().min(0).max(100),
    coordinates: z.object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    }),
    streamUrl: z.string().url().optional(),
  }),
});

// ================================================
// FAN PROFILE VALIDATIONS
// ================================================

export const updateFanProfileSchema = z.object({
  body: z.object({
    preferredZone: z.string().optional(),
    emergencyContact: z.string().optional(),
    favorites: z.array(z.string()).optional(),
  }),
});

// ================================================
// PRACTICE SESSION VALIDATIONS
// ================================================

export const schedulePracticeSchema = z.object({
  body: z.object({
    teamId: z.string(),
    venueId: z.string(),
    dateTime: z.string().datetime(),
    durationMinutes: z.number().int().min(30).max(480),
    notes: z.string().optional(),
  }),
});

// ================================================
// AI VALIDATIONS
// ================================================

export const aiMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty.'),
    context: z.string().optional(),
    model: z.enum(['gemini', 'openai', 'whisper']).optional(),
  }),
});

export const naturalLanguageQuerySchema = z.object({
  body: z.object({
    query: z.string().min(1),
    domain: z.string().optional(),
  }),
});

export const visionAnalysisSchema = z.object({
  body: z.object({
    imageUrl: z.string().url(),
    analysisType: z.enum(['crowd_density', 'object_detection', 'anomaly_detection']),
    stadiumId: z.string().optional(),
  }),
});

export const predictionRequestSchema = z.object({
  body: z.object({
    type: z.enum(['attendance', 'revenue', 'crowd_flow', 'weather_impact']),
    stadiumId: z.string(),
    parameters: z.record(z.any()).optional(),
  }),
});

export const updateSeatMapSchema = z.object({
  body: z.object({
    zone: z.string(),
    updates: z.array(z.object({
      seatNumber: z.string(),
      status: z.enum(['available', 'reserved', 'occupied', 'blocked']),
    })),
  }),
});
