import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Enterprise Mock Token for out-of-the-box local testing & verification
const MOCK_TOKEN = 'valid-admin-token';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${MOCK_TOKEN}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 5000,
    });

    socketInstance.on('connect', () => {
      console.info('ARES AI: Connected to backend Socket.IO gateway.');
    });

    socketInstance.on('disconnect', () => {
      console.warn('ARES AI: Disconnected from backend Socket.IO gateway.');
    });
  }
  return socketInstance;
}
