/**
 * Texas 42 API Types
 */

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * WebSocket message structure
 */
export interface WebSocketMessage {
  type: string;
  gameId?: string;
  playerId?: string;
  data?: unknown;
  timestamp: string;
}