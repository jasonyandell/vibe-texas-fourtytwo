/**
 * API Types
 * API-related types for Texas 42
 */

// API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  gameId?: string;
  playerId?: string;
  data?: unknown;
  timestamp: string;
}