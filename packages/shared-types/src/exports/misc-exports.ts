/**
 * Miscellaneous Exports Module
 * Contains remaining exports not categorized elsewhere
 */

// Lobby exports
export type {
  LobbyGame,
  LobbyState
} from '../lobby';

export {
  createEmptyLobbyState
} from '../lobby';

// API exports
export type {
  ApiResponse,
  WebSocketMessage
} from '../api';

// Frontend compatibility exports
export type { LegacyGameState } from '../frontend-compat';

export {
  convertToLegacyGameState,
  convertFromLegacyGameState,
  isValidLegacyGameState,
  createEmptyGameState as createEmptyLegacyGameState,
  createCompatibleBid,
  createCompatiblePlayedDomino,
  createCompatibleBiddingState,
  createCompatibleTrick
} from '../frontend-compat';

// Package information
export const PACKAGE_INFO = {
  name: '@texas42/shared-types',
  version: '1.0.0',
  description: 'Shared TypeScript types for Texas 42 game frontend and backend',
  author: 'Texas 42 Development Team',
  license: 'MIT'
} as const;