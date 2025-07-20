"use strict";
/**
 * Texas 42 Game Constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_CONSTANTS = void 0;
/**
 * Constants for game state management
 */
exports.GAME_CONSTANTS = {
    /** Maximum players in a Texas 42 game */
    MAX_PLAYERS: 4,
    /** Number of tricks per hand */
    TRICKS_PER_HAND: 7,
    /** Default marks to win */
    DEFAULT_MARKS_TO_WIN: 7,
    /** Default points to win (for point-based games) */
    DEFAULT_POINTS_TO_WIN: 250,
    /** All player positions */
    PLAYER_POSITIONS: ['north', 'east', 'south', 'west'],
    /** All partnership teams */
    PARTNERSHIP_TEAMS: ['northSouth', 'eastWest'],
    /** All game phases */
    GAME_PHASES: ['bidding', 'playing', 'scoring', 'finished']
};
//# sourceMappingURL=constants.js.map