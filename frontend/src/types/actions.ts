/**
 * Action Types
 * Game action types for Texas 42
 */

import type { Bid } from './bidding';
import type { Domino } from './domino';

// Game actions
export type GameAction = 
  | { type: 'JOIN_GAME'; playerId: string; playerName: string }
  | { type: 'LEAVE_GAME'; playerId: string }
  | { type: 'READY_PLAYER'; playerId: string }
  | { type: 'START_GAME' }
  | { type: 'PLACE_BID'; playerId: string; bid: Bid }
  | { type: 'PLAY_DOMINO'; playerId: string; domino: Domino }
  | { type: 'RESET_GAME' };