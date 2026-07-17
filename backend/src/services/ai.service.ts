import { AIConversationRepository } from '../repositories/specialized.repository';
import { AIConversation } from '../models';
import { config } from '../config/app';
import logger from '../utilities/logger';

class AIService {
  async sendMessage(userId: string, userMessage: string, context?: string, model?: string): Promise<string> {
    logger.info(`AI message from user ${userId} using model ${model || 'default'}: "${userMessage}"`);

    let conversation: AIConversation | null = null;
    const history = await AIConversationRepository.query('userId', '==', userId);
    
    if (history.length > 0) {
      conversation = history[0];
    } else {
      conversation = await AIConversationRepository.create({
        userId,
        messages: [],
        createdAt: new Date(),
      });
    }

    let aiResponse = "I have processed your query. Gate A is showing nominal density, while Parking Lot C is at 94% occupancy. Would you like me to allocate Lot D overflow?";

    const queryLower = userMessage.toLowerCase();
    if (queryLower.includes('parking') || queryLower.includes('lot')) {
      aiResponse = "Parking telemetry report: Lot B is currently congested. Recommendation: redirect VIP arrivals to Lot A and dispatch additional parking staff.";
    } else if (queryLower.includes('crowd') || queryLower.includes('gate') || queryLower.includes('density')) {
      aiResponse = "Crowd flow warning: Gate C is at 91% capacity. Rerouting recommendation: shift incoming ticketing lines to Gate B. Expected mitigation time: 5 minutes.";
    } else if (queryLower.includes('energy') || queryLower.includes('power') || queryLower.includes('water')) {
      aiResponse = "Utility status: Main power draw is 4.2 MW. Solar grid supplying 21% capacity. Water leak alerts: None detected in the last 60 minutes.";
    } else if (queryLower.includes('anomaly') || queryLower.includes('incident') || queryLower.includes('security')) {
      aiResponse = "Security status: Camera feeds in Sector 4 detected an abandoned object at 20:14. Incident unit 08 is checking the site. All other zones report nominal.";
    }

    // Call external LLM APIs if configured
    if (config.ai.geminiKey && config.ai.geminiKey !== 'mock-gemini-key') {
      logger.info('Gemini AI integration active.');
      // Execute gemini models queries here
    } else if (config.ai.openaiKey && config.ai.openaiKey !== 'mock-openai-key') {
      logger.info('OpenAI AI integration active.');
      // Execute openai models queries here
    }

    const updatedMessages = [
      ...conversation.messages,
      { sender: 'user' as const, text: userMessage, timestamp: new Date() },
      { sender: 'assistant' as const, text: aiResponse, timestamp: new Date() },
    ];

    await AIConversationRepository.update(conversation.id!, {
      messages: updatedMessages,
    });

    return aiResponse;
  }

  async getConversationHistory(conversationId: string) {
    const record = await AIConversationRepository.getById(conversationId);
    if (!record) throw new Error('Conversation not found');
    return record;
  }

  async listConversations(userId: string) {
    const list = await AIConversationRepository.query('userId', '==', userId);
    return list;
  }

  async naturalLanguageQuery(query: string, domain?: string) {
    logger.info(`NLP parsing on: "${query}" in domain: ${domain || 'general'}`);
    return {
      parsedQuery: query,
      intent: 'fetch_telemetry_metrics',
      entities: {
        domain: domain || 'parking',
        timeframe: 'last_1_hour',
        location: 'Sector A'
      },
      confidenceScore: 0.94,
      suggestedAction: 'redirect_crowd_flow'
    };
  }

  async generateReport(data: any) {
    logger.info(`Generating AI report type: ${data.type}`);
    return {
      reportId: `rep_ai_${Math.floor(Math.random() * 90000) + 10000}`,
      type: data.type,
      format: data.format,
      summary: "This report consolidates crowd movements, smart utilities usage, and parking revenues. Grid energy draws decreased by 4% due to peak solar efficiency. Zero critical safety anomalies were logged during matches.",
      sectionsCompiled: data.sections || ['crowd', 'security', 'utilities'],
      downloadUrl: `https://storage.arenaos.internal/reports/ai_stadium_summary_${data.type}.${data.format}`
    };
  }

  async analyzeVision(data: any) {
    logger.info(`Running vision parser on: ${data.imageUrl} (Type: ${data.analysisType})`);
    return {
      status: 'success',
      analysisType: data.analysisType,
      anomaliesDetected: 0,
      crowdDensityPct: 62.4,
      alertsTriggered: false,
      details: "Image frame indicates nominal crowd distribution. No restricted-area violations detected."
    };
  }

  async predict(data: any) {
    logger.info(`Running prediction forecasting: ${data.type} for stadium ${data.stadiumId}`);
    return {
      type: data.type,
      stadiumId: data.stadiumId,
      forecastedValue: data.type === 'attendance' ? 58240 : 124500,
      confidenceInterval: [92.4, 96.8],
      factorsIncluded: ['weather', 'historical_trends', 'ticket_pre_bookings'],
      predictionModel: 'ARES_Forecasting_Engine_v2.1'
    };
  }
}

export const aiService = new AIService();
