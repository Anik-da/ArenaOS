import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fetchAPI } from './api';

describe('fetchAPI', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('performs fetch with mock authorization and returns JSON data', async () => {
    const mockResponse = { data: 'stadium-status' };
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchAPI('/test-endpoint');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test-endpoint'),
      expect.objectContaining({
        headers: expect.any(Headers)
      })
    );

    const callArgs = vi.mocked(global.fetch).mock.calls[0];
    const headers = callArgs[1]?.headers as Headers;
    
    expect(headers.get('Authorization')).toBe('Bearer valid-admin-token');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(result).toEqual(mockResponse);
  });

  it('throws an error if the response is not OK', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      json: () => Promise.resolve({ message: 'Insufficient privileges' }),
    });

    await expect(fetchAPI('/admin')).rejects.toThrow('Insufficient privileges');
  });

  it('falls back to statusText error message if json parsing fails on non-OK response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.reject(new Error('JSON parse error')),
    });

    await expect(fetchAPI('/error')).rejects.toThrow('API error: 500 Internal Server Error');
  });
});
