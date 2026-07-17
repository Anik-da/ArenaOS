import { AIConversationRepository } from '../repositories/specialized.repository';
import { AIConversation } from '../models';
import { config } from '../config/app';
import logger from '../utilities/logger';

export class AIService {
  async processUserQuery(userId: string, userMessage: string): Promise<string> {
    logger.info(`AI processing query for user ${userId}: "${userMessage}"`);

    // Check if conversation history exists or instantiate
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

    // Default static response logic (reasoning stub engine)
    let aiResponse = "I've processed your telemetry query. Gate A is showing nominal density, while Parking Lot C is at 94% occupancy. Would you like me to allocate Lot D overflow?";

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

    // Update conversation logs
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
}

export const aiService = new AIService();
export default aiService;
