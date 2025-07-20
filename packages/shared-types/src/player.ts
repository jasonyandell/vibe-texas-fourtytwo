/**
 * Texas 42 Player Types
 */

import { Domino } from './dominoes';

/**
 * Player positions in Texas 42 partnerships
 * North-South vs East-West partnerships
 */
export type PlayerPosition = 'north' | 'east' | 'south' | 'west';

/**
 * Player information
 */
export interface Player {
  /** Unique player identifier */
  id: string;
  /** Player display name */
  name: string;
  /** Player position at table */
  position: PlayerPosition;
  /** Current hand of dominoes */
  hand: Domino[];
  /** Connection status */
  isConnected: boolean;
  /** Ready status for game start */
  isReady: boolean;
}