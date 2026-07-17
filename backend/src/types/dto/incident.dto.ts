/**
 * ARES AI Platform — Incident, Security, Medical & Emergency DTOs
 */

export interface CreateSecurityEventDTO {
  stadiumId: string;
  type: string;
  zoneId: string;
  severity: string;
  description: string;
}

export interface UpdateSecurityEventDTO {
  status?: string;
  assignedResponderId?: string;
  resolutionNotes?: string;
}

export interface CreateMedicalEventDTO {
  stadiumId: string;
  type: string;
  patientName?: string;
  zoneId?: string;
  description?: string;
}

export interface DispatchAmbulanceDTO {
  medicalEventId: string;
  ambulanceId: string;
}

export interface AssignDoctorDTO {
  medicalEventId: string;
  doctorId: string;
}

export interface CreateEmergencyAlertDTO {
  title: string;
  description: string;
  severity: string;
  broadcastScope: string;
  stadiumId?: string;
}

export interface UpdateEmergencyAlertDTO {
  active?: boolean;
  severity?: string;
  description?: string;
}

export interface SOSAlertDTO {
  userId: string;
  stadiumId: string;
  zoneId?: string;
  message?: string;
  coordinates?: { lat: number; lng: number };
}
