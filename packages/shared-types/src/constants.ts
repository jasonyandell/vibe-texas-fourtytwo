/**
 * Texas 42 Game Constants
 */

/**
 * Constants for game state management
 */
export const GAME_CONSTANTS = {
  /** Maximum players in a Texas 42 game */
  MAX_PLAYERS: 4,
  /** Number of tricks per hand */
  TRICKS_PER_HAND: 7,
  /** Default marks to win */
  DEFAULT_MARKS_TO_WIN: 7,
  /** Default points to win (for point-based games) */
  DEFAULT_POINTS_TO_WIN: 250,
  /** All player positions */
  PLAYER_POSITIONS: ['north', 'east', 'south', 'west'] as const,
  /** All partnership teams */
  PARTNERSHIP_TEAMS: ['northSouth', 'eastWest'] as const,
  /** All game phases */
  GAME_PHASES: ['bidding', 'playing', 'scoring', 'finished'] as const
} as const;