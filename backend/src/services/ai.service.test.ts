import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { aiService } from './ai.service';
import { AIConversationRepository } from '../repositories/specialized.repository';

vi.mock('../repositories/specialized.repository', () => {
  return {
    AIConversationRepository: {
      query: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 'conv-new', ...data })),
      update: vi.fn().mockResolvedValue(true),
    }
  };
});

describe('AIService', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('sendMessage', () => {
    it('creates a new conversation and returns an offline fallback when API call fails', async () => {
      // Mock fetch to reject
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.mocked(AIConversationRepository.query).mockResolvedValue([]);

      const response = await aiService.sendMessage('user-1', 'What is the parking status?');
      
      // Should create conversation
      expect(AIConversationRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user-1'
      }));

      // Should return parking fallback response
      expect(response).toContain('Parking telemetry report');
    });

    it('returns the AI response if the external Hugging Face API call succeeds', async () => {
      // Mock fetch to succeed
      const mockResult = {
        choices: [
          {
            message: {
              content: 'Mocked Llama Response for stadium'
            }
          }
        ]
      };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult)
      });
      vi.mocked(AIConversationRepository.query).mockResolvedValue([{ id: 'conv-1', userId: 'user-1', messages: [] }]);

      const response = await aiService.sendMessage('user-1', 'Hello');
      expect(response).toBe('Mocked Llama Response for stadium');
    });

    it('handles query matching offline fallbacks correctly', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Timeout'));
      vi.mocked(AIConversationRepository.query).mockResolvedValue([{ id: 'conv-1', userId: 'user-1', messages: [] }]);

      const responseCrowd = await aiService.sendMessage('user-1', 'gate density levels');
      expect(responseCrowd).toContain('Crowd flow warning');

      const responseEnergy = await aiService.sendMessage('user-1', 'main power and energy usage');
      expect(responseEnergy).toContain('Utility status');
    });
  });
});
