/**
 * ARES AI Platform — AI Module DTOs
 */

export interface AIQueryDTO {
  message: string;
  context?: string;
  model?: 'gemini' | 'openai' | 'whisper';
}

export interface AIConversationDTO {
  userId: string;
  messages: { sender: string; text: string; timestamp: Date }[];
}

export interface ReportGenerateDTO {
  type: string;
  format: string;
  stadiumId?: string;
  tournamentId?: string;
  dateFrom?: string;
  dateTo?: string;
  sections?: string[];
}

export interface NaturalLanguageQueryDTO {
  query: string;
  domain?: string;
}

export interface VisionAnalysisDTO {
  imageUrl: string;
  analysisType: 'crowd_density' | 'object_detection' | 'anomaly_detection';
  stadiumId?: string;
}

export interface PredictionRequestDTO {
  type: 'attendance' | 'revenue' | 'crowd_flow' | 'weather_impact';
  stadiumId: string;
  parameters?: Record<string, any>;
}
