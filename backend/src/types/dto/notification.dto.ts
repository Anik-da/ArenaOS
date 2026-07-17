/**
 * ARES AI Platform — Notification DTOs
 */

export interface SendNotificationDTO {
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
}

export interface BroadcastNotificationDTO {
  title: string;
  body: string;
  type: string;
  targetRole?: string;
  stadiumId?: string;
  data?: Record<string, any>;
}

export interface MarkReadDTO {
  notificationIds: string[];
}
