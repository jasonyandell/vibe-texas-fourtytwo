/**
 * Mock WebSocket implementation for tests
 */
export class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  
  constructor(_url: string) {
    setTimeout(() => {
      if (this.onopen) this.onopen({} as Event);
    }, 100);
  }
  
  send() { /* mock */ }
  close() { /* mock */ }
}

/**
 * Inject mock WebSocket into page context
 */
export function injectMockWebSocket() {
  return () => {
    // Override WebSocket to prevent actual connections during tests
    (window as typeof window & { WebSocket: unknown }).WebSocket = MockWebSocket as unknown as typeof WebSocket;
  };
}